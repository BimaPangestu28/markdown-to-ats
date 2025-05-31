/**
 * Application messages and text constants
 */

export const ERROR_MESSAGES = {
  FILE_NOT_FOUND: (filePath) => `Error: File "${filePath}" does not exist`,
  INVALID_FILE_TYPE: 'Error: Input file must be a markdown (.md) file',
  FILE_READ_ERROR: (error) => `Error reading file: ${error}`,
  PDF_GENERATION_ERROR: (error) => `Error generating PDF: ${error}`,
  BROWSER_LAUNCH_ERROR: 'Failed to launch browser for PDF generation',
  CONTENT_PROCESSING_ERROR: 'Failed to process markdown content',
  UNHANDLED_REJECTION: 'Unhandled Rejection at:'
};

export const SUCCESS_MESSAGES = {
  PDF_GENERATED: (outputPath) => `✓ PDF generated successfully: ${outputPath}`,
  BROWSER_LAUNCHED: 'Launching browser...',
  PROCESSING_CONTENT: 'Processing content...',
  GENERATING_PDF: 'Generating PDF...',
  GENERATION_COMPLETED: '✓ CV generation completed successfully!',
  TEMPLATE_FOUND: '✓ Template file found: template.md',
  PROJECT_READY: 'Ready to generate your professional CV! 🚀'
};

export const INFO_MESSAGES = {
  READING_FILE: (inputPath) => `Reading markdown file: ${inputPath}`,
  TEMPLATE_GUIDANCE: 'You can edit this file with your information',
  TEMPLATE_NOT_FOUND: '⚠ Template file not found',
  CREATE_TEMPLATE: 'Create a template.md file with your CV content'
};

export const CLI_MESSAGES = {
  WELCOME_TITLE: '=== Markdown to ATS CV Generator ===',
  WELCOME_SUBTITLE: 'Generate professional ATS-friendly CV PDFs from markdown files',
  GENERATION_TITLE: '=== Professional ATS CV Generator ===',
  USAGE_EXAMPLES_TITLE: 'Usage Examples:',
  COMMANDS_TITLE: 'Available Commands:',
  PROJECT_STRUCTURE_TITLE: 'Project Structure:',
  FEATURES_TITLE: 'Features:'
};

export const CLI_EXAMPLES = [
  'npm run generate template.md',
  'npm run generate my-cv.md -o john-doe-cv.pdf',
  'node src/generateCv.js template.md --output professional-cv.pdf'
];

export const CLI_COMMANDS = [
  { command: 'npm start', description: 'Show this help message' },
  { command: 'npm run generate', description: 'Generate CV from markdown' },
  { command: 'npm run dev', description: 'Run in development mode' }
];

export const FEATURES_LIST = [
  '• ATS-friendly formatting',
  '• Professional styling',
  '• Clean, readable layout',
  '• PDF output optimization',
  '• Command-line interface'
];