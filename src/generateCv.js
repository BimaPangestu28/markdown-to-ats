#!/usr/bin/env node

import path from 'path';
import { program } from 'commander';
import { validateMarkdownFile } from './utils/fileValidator.js';
import { MarkdownParserService } from './services/markdownParser.js';
import { HtmlGeneratorService } from './services/htmlGenerator.js';
import { PdfGeneratorService } from './services/pdfGenerator.js';
import { Logger } from './utils/logger.js';
import { CLI_MESSAGES, SUCCESS_MESSAGES } from './constants/messages.js';

/**
 * Professional ATS CV Generator
 * Converts markdown files to professional ATS-friendly PDF CVs
 */
class CvGenerator {
    /**
     * Generate CV PDF from markdown file
     * 
     * @param {string} inputPath - Path to input markdown file
     * @param {string} outputPath - Path for output PDF file
     */
    static async generateCvPdf(inputPath, outputPath) {
        Logger.title(`\n${CLI_MESSAGES.GENERATION_TITLE}\n`);
        
        try {
            // Validate input file
            this._validateInput(inputPath);
            
            // Parse markdown content
            const htmlContent = this._parseMarkdownContent(inputPath);
            
            // Generate complete HTML document
            const completeHtml = this._generateHtmlDocument(htmlContent);
            
            // Generate PDF
            await this._generatePdf(completeHtml, outputPath);
            
            Logger.success(`\n${SUCCESS_MESSAGES.GENERATION_COMPLETED}`);
            
        } catch (error) {
            Logger.error(error.message);
            process.exit(1);
        }
    }

    /**
     * Validate input file
     * @param {string} inputPath - Path to validate
     * @private
     */
    static _validateInput(inputPath) {
        validateMarkdownFile(inputPath);
    }

    /**
     * Parse markdown content to HTML
     * @param {string} inputPath - Path to markdown file
     * @returns {string} Parsed HTML content
     * @private
     */
    static _parseMarkdownContent(inputPath) {
        Logger.info(`Reading markdown file: ${inputPath}`);
        return MarkdownParserService.parseMarkdownFile(inputPath);
    }

    /**
     * Generate complete HTML document
     * @param {string} htmlContent - Parsed HTML content
     * @returns {string} Complete HTML document
     * @private
     */
    static _generateHtmlDocument(htmlContent) {
        const optimizedContent = HtmlGeneratorService.optimizeForATS(htmlContent);
        return HtmlGeneratorService.generateCompleteDocument(optimizedContent);
    }

    /**
     * Generate PDF from HTML
     * @param {string} htmlContent - Complete HTML document
     * @param {string} outputPath - Output file path
     * @private
     */
    static async _generatePdf(htmlContent, outputPath) {
        PdfGeneratorService.validatePdfGeneration(outputPath);
        await PdfGeneratorService.generatePdfFromHtml(htmlContent, outputPath);
    }
}

// CLI setup
program
    .version('1.0.0')
    .description('Generate professional ATS-friendly CV PDFs from markdown')
    .argument('<input>', 'Input markdown file path')
    .option('-o, --output <path>', 'Output PDF file path', 'cv.pdf')
    .action(async (input, options) => {
        const inputPath = path.resolve(input);
        const outputPath = path.resolve(options.output);
        
        await CvGenerator.generateCvPdf(inputPath, outputPath);
    });

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    Logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    process.exit(1);
});

program.parse();