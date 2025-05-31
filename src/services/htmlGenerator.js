import { StyleGeneratorService } from './styleGenerator.js';

/**
 * Service for generating complete HTML documents from parsed content
 */
export class HtmlGeneratorService {
    /**
     * Generate complete HTML document with CV content and styling
     * 
     * @param {string} htmlContent - Parsed HTML content from markdown
     * @param {string} title - Document title (default: 'Professional CV')
     * @returns {string} Complete HTML document
     */
    static generateCompleteDocument(htmlContent, title = 'Professional CV') {
        const styles = StyleGeneratorService.generateProfessionalStyles();
        
        return this._buildHtmlDocument(htmlContent, styles, title);
    }

    /**
     * Build the complete HTML document structure
     * 
     * @param {string} content - HTML content
     * @param {string} styles - CSS styles
     * @param {string} title - Document title
     * @returns {string} Complete HTML document
     * @private
     */
    static _buildHtmlDocument(content, styles, title) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    ${this._generateHtmlHead(title, styles)}
</head>
<body>
    ${content}
</body>
</html>`;
    }

    /**
     * Generate HTML head section with metadata and styles
     * 
     * @param {string} title - Document title
     * @param {string} styles - CSS styles
     * @returns {string} HTML head content
     * @private
     */
    static _generateHtmlHead(title, styles) {
        return `<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Professional CV generated from markdown">
    <meta name="generator" content="Markdown to ATS CV Generator">
    <title>${title}</title>
    <style>${styles}</style>`;
    }

    /**
     * Optimize HTML content for ATS parsing
     * 
     * @param {string} htmlContent - Original HTML content
     * @returns {string} ATS-optimized HTML content
     */
    static optimizeForATS(htmlContent) {
        return htmlContent
            .replace(/<strong>/g, '<b>')
            .replace(/<\/strong>/g, '</b>')
            .replace(/<em>/g, '<i>')
            .replace(/<\/em>/g, '</i>')
            .replace(/\s+/g, ' ')
            .trim();
    }
}