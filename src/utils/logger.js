import chalk from 'chalk';

/**
 * Logger utility for consistent console output formatting
 */

export class Logger {
    /**
     * Log info message in blue
     * @param {string} message - Message to log
     */
    static info(message) {
        console.log(chalk.blue(message));
    }

    /**
     * Log success message in green
     * @param {string} message - Message to log
     */
    static success(message) {
        console.log(chalk.green(message));
    }

    /**
     * Log error message in red
     * @param {string} message - Message to log
     */
    static error(message) {
        console.error(chalk.red(message));
    }

    /**
     * Log warning message in yellow
     * @param {string} message - Message to log
     */
    static warning(message) {
        console.log(chalk.yellow(message));
    }

    /**
     * Log title message in cyan and bold
     * @param {string} message - Message to log
     */
    static title(message) {
        console.log(chalk.cyan.bold(message));
    }

    /**
     * Log subtitle message in white
     * @param {string} message - Message to log
     */
    static subtitle(message) {
        console.log(chalk.white(message));
    }

    /**
     * Log muted message in gray
     * @param {string} message - Message to log
     */
    static muted(message) {
        console.log(chalk.gray(message));
    }

    /**
     * Log cyan message
     * @param {string} message - Message to log
     */
    static cyan(message) {
        console.log(chalk.cyan(message));
    }

    /**
     * Create a newline for spacing
     */
    static newline() {
        console.log();
    }
}