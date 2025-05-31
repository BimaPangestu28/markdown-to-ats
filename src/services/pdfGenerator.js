import puppeteer from 'puppeteer';
import { PDF_CONFIG, BROWSER_CONFIG, PAGE_CONFIG } from '../config/pdfConfig.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/messages.js';
import { Logger } from '../utils/logger.js';

/**
 * Service for generating PDF documents from HTML content
 */
export class PdfGeneratorService {
    /**
     * Generate PDF from HTML content using Puppeteer
     * 
     * @param {string} htmlContent - Complete HTML document
     * @param {string} outputPath - Path where PDF should be saved
     * @throws {Error} When PDF generation fails
     */
    static async generatePdfFromHtml(htmlContent, outputPath) {
        let browser = null;
        
        try {
            browser = await this._launchBrowser();
            const page = await this._createPage(browser);
            
            await this._setPageContent(page, htmlContent);
            await this._generatePdf(page, outputPath);
            
            Logger.success(SUCCESS_MESSAGES.PDF_GENERATED(outputPath));
            
        } catch (error) {
            Logger.error(ERROR_MESSAGES.PDF_GENERATION_ERROR(error.message));
            throw error;
        } finally {
            if (browser) {
                await this._closeBrowser(browser);
            }
        }
    }

    /**
     * Launch Puppeteer browser with optimized configuration
     * 
     * @returns {Promise<Browser>} Puppeteer browser instance
     * @throws {Error} When browser launch fails
     * @private
     */
    static async _launchBrowser() {
        try {
            Logger.info(SUCCESS_MESSAGES.BROWSER_LAUNCHED);
            return await puppeteer.launch(BROWSER_CONFIG);
        } catch (error) {
            throw new Error(ERROR_MESSAGES.BROWSER_LAUNCH_ERROR);
        }
    }

    /**
     * Create a new page in the browser
     * 
     * @param {Browser} browser - Puppeteer browser instance
     * @returns {Promise<Page>} Puppeteer page instance
     * @private
     */
    static async _createPage(browser) {
        return await browser.newPage();
    }

    /**
     * Set HTML content on the page
     * 
     * @param {Page} page - Puppeteer page instance
     * @param {string} htmlContent - HTML content to set
     * @private
     */
    static async _setPageContent(page, htmlContent) {
        Logger.info(SUCCESS_MESSAGES.PROCESSING_CONTENT);
        await page.setContent(htmlContent, PAGE_CONFIG);
    }

    /**
     * Generate PDF from the page
     * 
     * @param {Page} page - Puppeteer page instance
     * @param {string} outputPath - Output file path
     * @private
     */
    static async _generatePdf(page, outputPath) {
        Logger.info(SUCCESS_MESSAGES.GENERATING_PDF);
        await page.pdf({
            path: outputPath,
            ...PDF_CONFIG
        });
    }

    /**
     * Close browser instance safely
     * 
     * @param {Browser} browser - Puppeteer browser instance
     * @private
     */
    static async _closeBrowser(browser) {
        try {
            await browser.close();
        } catch (error) {
            Logger.warning(`Warning: Failed to close browser: ${error.message}`);
        }
    }

    /**
     * Validate PDF generation prerequisites
     * 
     * @param {string} outputPath - Output file path
     * @throws {Error} When validation fails
     */
    static validatePdfGeneration(outputPath) {
        if (!outputPath || typeof outputPath !== 'string') {
            throw new Error('Output path must be a valid string');
        }
        
        if (!outputPath.endsWith('.pdf')) {
            throw new Error('Output file must have .pdf extension');
        }
    }
}