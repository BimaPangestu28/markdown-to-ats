/**
 * PDF generation configuration settings
 */

export const PDF_CONFIG = {
  format: 'A4',
  printBackground: true,
  margin: {
    top: '10mm',
    bottom: '10mm',
    left: '10mm',
    right: '10mm'
  },
  preferCSSPageSize: true
};

export const BROWSER_CONFIG = {
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu'
  ]
};

export const PAGE_CONFIG = {
  waitUntil: 'networkidle0',
  timeout: 30000
};