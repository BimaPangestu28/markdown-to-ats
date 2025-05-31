import { marked } from 'marked';
import { readFileContent } from '../utils/fileValidator.js';
import { ERROR_MESSAGES } from '../constants/messages.js';

/**
 * Service for parsing markdown files to HTML
 */
export class MarkdownParserService {
    /**
     * Parse markdown file to HTML
     * 
     * @param {string} filePath - Path to the markdown file
     * @returns {string} Parsed HTML content
     * @throws {Error} When parsing fails
     */
    static parseMarkdownFile(filePath) {
        try {
            const markdownContent = readFileContent(filePath);
            return marked(markdownContent);
        } catch (error) {
            throw new Error(ERROR_MESSAGES.CONTENT_PROCESSING_ERROR);
        }
    }

    /**
     * Parse markdown string to HTML
     * 
     * @param {string} markdownContent - Markdown content string
     * @returns {string} Parsed HTML content
     * @throws {Error} When parsing fails
     */
    static parseMarkdownString(markdownContent) {
        try {
            return marked(markdownContent);
        } catch (error) {
            throw new Error(ERROR_MESSAGES.CONTENT_PROCESSING_ERROR);
        }
    }
}