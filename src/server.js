#!/usr/bin/env node

import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { MarkdownParserService } from './services/markdownParser.js';
import { HtmlGeneratorService } from './services/htmlGenerator.js';
import { PdfGeneratorService } from './services/pdfGenerator.js';
import { Logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

/**
 * Express server for Markdown to ATS CV Generator web interface
 */
class CvGeneratorServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8081;
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    /**
     * Setup Express middleware
     */
    setupMiddleware() {
        // CORS configuration
        this.app.use(cors({
            origin: process.env.NODE_ENV === 'production' 
                ? process.env.FRONTEND_URL 
                : 'http://localhost:8081',
            credentials: true
        }));

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Static files
        this.app.use(express.static(path.join(rootDir, 'public')));

        // File upload configuration
        this.setupMulter();

        // Request logging
        this.app.use((req, res, next) => {
            Logger.info(`${req.method} ${req.path} - ${req.ip}`);
            next();
        });
    }

    /**
     * Setup multer for file uploads
     */
    setupMulter() {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const uploadDir = path.join(rootDir, 'public', 'uploads');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                cb(null, uploadDir);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, `cv-${uniqueSuffix}.md`);
            }
        });

        this.upload = multer({
            storage: storage,
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB limit
                files: 1
            },
            fileFilter: (req, file, cb) => {
                if (file.mimetype === 'text/markdown' || file.originalname.endsWith('.md')) {
                    cb(null, true);
                } else {
                    cb(new Error('Only markdown files are allowed'), false);
                }
            }
        });
    }

    /**
     * Setup application routes
     */
    setupRoutes() {
        // Serve main page
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(rootDir, 'public', 'index.html'));
        });

        // Download template
        this.app.get('/api/template', (req, res) => {
            const templatePath = path.join(rootDir, 'template.md');
            if (fs.existsSync(templatePath)) {
                res.download(templatePath, 'cv-template.md');
            } else {
                res.status(404).json({ error: 'Template not found' });
            }
        });

        // Generate CV from uploaded markdown
        this.app.post('/api/generate', this.upload.single('markdown'), async (req, res) => {
            try {
                await this.handleCvGeneration(req, res);
            } catch (error) {
                Logger.error(`CV generation error: ${error.message}`);
                res.status(500).json({ 
                    error: 'Failed to generate CV',
                    details: error.message 
                });
            }
        });

        // Download generated PDF
        this.app.get('/api/download/:filename', (req, res) => {
            const filename = req.params.filename;
            const filePath = path.join(rootDir, 'public', 'uploads', filename);
            
            if (fs.existsSync(filePath) && filename.endsWith('.pdf')) {
                res.download(filePath, filename, (err) => {
                    if (err) {
                        Logger.error(`Download error: ${err.message}`);
                        res.status(500).json({ error: 'Download failed' });
                    }
                });
            } else {
                res.status(404).json({ error: 'File not found' });
            }
        });

        // Preview markdown as HTML
        this.app.post('/api/preview', this.upload.single('markdown'), async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ error: 'No file uploaded' });
                }

                const htmlContent = MarkdownParserService.parseMarkdownFile(req.file.path);
                
                // Clean up uploaded file
                fs.unlinkSync(req.file.path);
                
                res.json({ html: htmlContent });
            } catch (error) {
                Logger.error(`Preview error: ${error.message}`);
                res.status(500).json({ 
                    error: 'Failed to generate preview',
                    details: error.message 
                });
            }
        });

        // Health check
        this.app.get('/api/health', (req, res) => {
            res.json({ 
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });

        // API documentation
        this.app.get('/api', (req, res) => {
            res.json({
                name: 'Markdown to ATS CV Generator API',
                version: '1.0.0',
                endpoints: {
                    'GET /': 'Serve main application',
                    'GET /api/template': 'Download CV template',
                    'POST /api/generate': 'Generate CV PDF from markdown',
                    'GET /api/download/:filename': 'Download generated PDF',
                    'POST /api/preview': 'Preview markdown as HTML',
                    'GET /api/health': 'Health check',
                    'GET /api': 'This documentation'
                }
            });
        });
    }

    /**
     * Handle CV generation request
     */
    async handleCvGeneration(req, res) {
        if (!req.file) {
            return res.status(400).json({ error: 'No markdown file uploaded' });
        }

        const { optimizeATS = 'true', includeMetadata = 'true' } = req.body;
        const markdownPath = req.file.path;
        
        try {
            // Generate unique filename for PDF
            const timestamp = Date.now();
            const pdfFilename = `cv-${timestamp}.pdf`;
            const pdfPath = path.join(path.dirname(markdownPath), pdfFilename);

            // Parse markdown to HTML
            Logger.info('Parsing markdown content...');
            const htmlContent = MarkdownParserService.parseMarkdownFile(markdownPath);

            // Generate complete HTML document
            Logger.info('Generating HTML document...');
            let completeHtml = HtmlGeneratorService.generateCompleteDocument(htmlContent);
            
            // Optimize for ATS if requested
            if (optimizeATS === 'true') {
                completeHtml = HtmlGeneratorService.optimizeForATS(completeHtml);
            }

            // Generate PDF
            Logger.info('Generating PDF...');
            PdfGeneratorService.validatePdfGeneration(pdfPath);
            await PdfGeneratorService.generatePdfFromHtml(completeHtml, pdfPath);

            // Clean up markdown file
            fs.unlinkSync(markdownPath);

            // Return success response
            res.json({
                success: true,
                filename: pdfFilename,
                message: 'CV generated successfully',
                downloadUrl: `/api/download/${pdfFilename}`,
                generatedAt: new Date().toISOString()
            });

            Logger.success(`CV generated successfully: ${pdfFilename}`);

        } catch (error) {
            // Clean up files on error
            if (fs.existsSync(markdownPath)) {
                fs.unlinkSync(markdownPath);
            }
            throw error;
        }
    }

    /**
     * Setup error handling middleware
     */
    setupErrorHandling() {
        // Handle multer errors
        this.app.use((error, req, res, next) => {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ 
                        error: 'File too large. Maximum size is 5MB.' 
                    });
                }
                if (error.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({ 
                        error: 'Unexpected file upload.' 
                    });
                }
            }
            
            if (error.message === 'Only markdown files are allowed') {
                return res.status(400).json({ 
                    error: 'Only markdown (.md) files are allowed.' 
                });
            }

            Logger.error(`Server error: ${error.message}`);
            res.status(500).json({ 
                error: 'Internal server error',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
            });
        });

        // Handle 404
        this.app.use((req, res) => {
            res.status(404).json({ 
                error: 'Route not found',
                path: req.path 
            });
        });
    }

    /**
     * Start the server
     */
    start() {
        this.app.listen(this.port, () => {
            Logger.success(`🚀 Server running on http://localhost:${this.port}`);
            Logger.info('📁 Serving static files from public/');
            Logger.info('📄 API documentation available at /api');
            
            if (process.env.NODE_ENV !== 'production') {
                Logger.info('🔧 Development mode - CORS enabled for all origins');
            }
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            Logger.info('SIGTERM received, shutting down gracefully...');
            process.exit(0);
        });

        process.on('SIGINT', () => {
            Logger.info('SIGINT received, shutting down gracefully...');
            process.exit(0);
        });
    }

    /**
     * Cleanup old files periodically
     */
    startCleanupJob() {
        const cleanupInterval = 60 * 60 * 1000; // 1 hour
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        setInterval(() => {
            this.cleanupOldFiles(maxAge);
        }, cleanupInterval);

        Logger.info('🧹 Cleanup job started - removing files older than 24 hours');
    }

    /**
     * Clean up old uploaded files
     */
    cleanupOldFiles(maxAge) {
        const uploadsDir = path.join(rootDir, 'public', 'uploads');
        
        if (!fs.existsSync(uploadsDir)) return;

        fs.readdir(uploadsDir, (err, files) => {
            if (err) {
                Logger.error(`Cleanup error: ${err.message}`);
                return;
            }

            files.forEach(file => {
                const filePath = path.join(uploadsDir, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) return;

                    const age = Date.now() - stats.mtime.getTime();
                    if (age > maxAge) {
                        fs.unlink(filePath, (err) => {
                            if (!err) {
                                Logger.info(`🗑️  Cleaned up old file: ${file}`);
                            }
                        });
                    }
                });
            });
        });
    }
}

// Start server
const server = new CvGeneratorServer();
server.start();
server.startCleanupJob();