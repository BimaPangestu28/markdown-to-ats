#!/usr/bin/env node

import { program } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import { fileExists } from './utils/fileValidator.js';
import { Logger } from './utils/logger.js';
import {
    CLI_MESSAGES,
    CLI_EXAMPLES,
    CLI_COMMANDS,
    FEATURES_LIST,
    SUCCESS_MESSAGES,
    INFO_MESSAGES
} from './constants/messages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main CLI interface for the CV generator
 */
class CliInterface {
    /**
     * Display welcome message and usage instructions
     */
    static displayWelcome() {
        Logger.title(`\n${CLI_MESSAGES.WELCOME_TITLE}`);
        Logger.subtitle(`${CLI_MESSAGES.WELCOME_SUBTITLE}\n`);
        
        this._displayUsageExamples();
        this._displayAvailableCommands();
        this._displayTemplateInfo();
    }

    /**
     * Display usage examples
     * @private
     */
    static _displayUsageExamples() {
        Logger.warning(CLI_MESSAGES.USAGE_EXAMPLES_TITLE);
        CLI_EXAMPLES.forEach(example => {
            Logger.muted(`  ${example}`);
        });
        Logger.newline();
    }

    /**
     * Display available commands
     * @private
     */
    static _displayAvailableCommands() {
        Logger.warning(CLI_MESSAGES.COMMANDS_TITLE);
        CLI_COMMANDS.forEach(({ command, description }) => {
            Logger.muted(`  ${command.padEnd(18)} - ${description}`);
        });
        Logger.newline();
    }

    /**
     * Display template file information
     * @private
     */
    static _displayTemplateInfo() {
        Logger.success('Template file: template.md');
        Logger.muted('Edit the template.md file with your information and run the generator.\n');
    }

    /**
     * Check if template file exists and provide guidance
     */
    static checkTemplateFile() {
        const templatePath = path.resolve(process.cwd(), 'template.md');
        
        if (fileExists(templatePath)) {
            Logger.success(SUCCESS_MESSAGES.TEMPLATE_FOUND);
            Logger.muted(`  ${INFO_MESSAGES.TEMPLATE_GUIDANCE}\n`);
        } else {
            Logger.warning(INFO_MESSAGES.TEMPLATE_NOT_FOUND);
            Logger.muted(`  ${INFO_MESSAGES.CREATE_TEMPLATE}\n`);
        }
    }

    /**
     * Display project information and structure
     */
    static displayProjectInfo() {
        Logger.warning(CLI_MESSAGES.PROJECT_STRUCTURE_TITLE);
        Logger.muted('  ├── src/');
        Logger.muted('  │   ├── services/        - Core business logic');
        Logger.muted('  │   ├── utils/           - Utility functions');
        Logger.muted('  │   ├── constants/       - Configuration constants');
        Logger.muted('  │   ├── config/          - Application configuration');
        Logger.muted('  │   ├── index.js         - Main entry point');
        Logger.muted('  │   └── generateCv.js    - PDF generation script');
        Logger.muted('  ├── template.md          - CV template file');
        Logger.muted('  └── package.json         - Project configuration\n');
        
        Logger.warning(CLI_MESSAGES.FEATURES_TITLE);
        FEATURES_LIST.forEach(feature => {
            Logger.muted(feature);
        });
        Logger.newline();
    }

    /**
     * Display complete interface
     */
    static displayComplete() {
        this.displayWelcome();
        this.checkTemplateFile();
        Logger.cyan(SUCCESS_MESSAGES.PROJECT_READY);
        Logger.newline();
    }
}

// CLI setup
program
    .version('1.0.0')
    .description('Markdown to ATS CV Generator - Main interface')
    .option('-i, --info', 'Show project information')
    .option('-h, --help', 'Show help information')
    .action((options) => {
        CliInterface.displayWelcome();
        
        if (options.info) {
            CliInterface.displayProjectInfo();
        }
        
        CliInterface.checkTemplateFile();
        
        Logger.cyan(SUCCESS_MESSAGES.PROJECT_READY);
        Logger.newline();
    });

program.parse();

// If no arguments provided, show welcome
if (process.argv.length <= 2) {
    CliInterface.displayComplete();
}