import fs from 'fs';
import { ERROR_MESSAGES } from '../constants/messages.js';

/**
 * Validates if the input file exists and is a valid markdown file
 * 
 * @param {string} filePath - Path to the file to validate
 * @returns {boolean} True if file is valid, false otherwise
 * @throws {Error} When file validation fails with specific error message
 */
export function validateMarkdownFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(ERROR_MESSAGES.FILE_NOT_FOUND(filePath));
    }
    
    if (!filePath.endsWith('.md')) {
        throw new Error(ERROR_MESSAGES.INVALID_FILE_TYPE);
    }
    
    return true;
}

/**
 * Checks if a file exists at the given path
 * 
 * @param {string} filePath - Path to check
 * @returns {boolean} True if file exists, false otherwise
 */
export function fileExists(filePath) {
    return fs.existsSync(filePath);
}

/**
 * Reads file content safely with error handling
 * 
 * @param {string} filePath - Path to the file to read
 * @param {string} encoding - File encoding (default: 'utf8')
 * @returns {string} File content
 * @throws {Error} When file cannot be read
 */
export function readFileContent(filePath, encoding = 'utf8') {
    try {
        return fs.readFileSync(filePath, encoding);
    } catch (error) {
        throw new Error(ERROR_MESSAGES.FILE_READ_ERROR(error.message));
    }
}