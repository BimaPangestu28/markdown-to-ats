# Markdown to ATS CV Generator

Generate professional ATS-friendly CV PDFs from markdown input with clean, professional styling optimized for Applicant Tracking Systems.

## Features

- **🎨 Beautiful Web Interface**: Modern, responsive UI built with Tailwind CSS
- **📱 Drag & Drop Upload**: Easy file upload with real-time preview
- **🤖 ATS-Friendly Formatting**: Clean structure that ATS systems can easily parse
- **✨ Professional Styling**: Modern, clean design with proper typography
- **📝 Markdown Input**: Write your CV in simple markdown format
- **📄 PDF Output**: High-quality PDF generation optimized for printing
- **⚡ Real-time Preview**: See your CV as you upload
- **💻 Dual Interface**: Both web UI and command line interface
- **📋 Template Included**: Professional CV template to get started quickly
- **🔒 Secure**: Files are automatically cleaned up after generation

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Installation

```bash
# Clone or create the project
cd markdown-to-ats

# Install dependencies
npm install
```

## Quick Start

### Web Interface (Recommended)
1. **Start the web server**:
   ```bash
   npm run server
   ```
2. **Open your browser**: Go to `http://localhost:8080`
3. **Upload your markdown**: Drag & drop or browse for your CV file
4. **Generate & Download**: Click generate and download your professional PDF

### Command Line Interface
1. **Edit the template file** (`template.md`) with your information
2. **Generate your CV**:
   ```bash
   npm run generate template.md
   ```
3. **Find your CV**: The generated PDF will be saved as `cv.pdf`

## Usage

### Basic Usage
```bash
# Generate CV from template
npm run generate template.md

# Specify output filename
npm run generate template.md -o john-doe-cv.pdf

# Use custom markdown file
npm run generate my-resume.md --output my-resume.pdf
```

### Available Commands
```bash
npm start          # Show help and project information
npm run generate   # Generate CV from markdown file (CLI)
npm run dev        # Run CLI in development mode with file watching
npm run server     # Start web server interface
npm run server:dev # Start web server in development mode
```

## Markdown Template Structure

The template follows this ATS-friendly structure:

```markdown
# Your Name

**Job Title** | Location  
Contact Information

---

## Professional Summary
Brief overview of your experience and skills

---

## Technical Skills
**Category:** Skill list

---

## Professional Experience

### Job Title | Company Name
**Location** | *Date Range*
- Achievement bullet points
- Quantified results when possible

---

## Education

### Degree | Institution
**Location** | *Date* | Additional info

---

## Projects
### Project Name
**Technologies:** Tech stack
- Project description and achievements

---

## Certifications
- Certification Name | Issuer | Date

---

## Languages
- Language: Proficiency level
```

## ATS Optimization Features

- **Clean Typography**: Uses standard fonts (Arial, Helvetica)
- **Proper Headings**: Clear section hierarchy with H1, H2, H3 tags
- **Simple Formatting**: No complex layouts that confuse ATS systems
- **Standard Sections**: Uses commonly recognized CV section names
- **Keyword Friendly**: Structure supports natural keyword inclusion
- **Machine Readable**: Clean HTML structure for parsing

## Styling Features

- Professional color scheme (blues and grays)
- Optimized for A4 printing
- Proper margins and spacing
- Section dividers and visual hierarchy
- Contact information prominently displayed
- Skills section with clear categorization

## Configuration

The generator includes built-in professional styling, but you can modify:

- **Font sizes**: Adjust in `src/generateCv.js` in the CSS section
- **Colors**: Modify color values in the styles
- **Spacing**: Adjust margins and padding
- **Page layout**: Modify PDF generation options

## Troubleshooting

### Common Issues

**PDF generation fails:**
- Ensure all dependencies are installed: `npm install`
- Check that the input markdown file exists and is readable
- Verify Node.js version (v16+ required)

**Styling issues:**
- The generator uses Puppeteer which requires Chrome/Chromium
- On Linux servers, you may need to install additional dependencies

**File not found:**
- Use absolute paths or ensure you're in the correct directory
- Check file permissions for both input and output locations

## Development

### Project Structure
```
├── src/
│   ├── services/        # Business logic services
│   │   ├── markdownParser.js    # Markdown to HTML conversion
│   │   ├── styleGenerator.js    # CSS styling generation
│   │   ├── htmlGenerator.js     # Complete HTML document generation
│   │   └── pdfGenerator.js      # PDF generation with Puppeteer
│   ├── utils/          # Utility functions
│   │   ├── fileValidator.js     # File validation utilities
│   │   └── logger.js            # Logging utilities
│   ├── constants/      # Application constants
│   │   ├── styling.js           # CSS styling constants
│   │   └── messages.js          # Application messages
│   ├── config/         # Configuration files
│   │   └── pdfConfig.js         # PDF generation configuration
│   ├── index.js        # CLI interface
│   ├── generateCv.js   # CLI PDF generation script
│   └── server.js       # Express web server
├── public/             # Web interface assets
│   ├── index.html      # Main web interface
│   ├── js/app.js       # Frontend JavaScript
│   └── uploads/        # Temporary file storage
├── template.md         # Professional CV template
├── package.json        # Project configuration
└── README.md          # This documentation
```

### Dependencies
- **puppeteer**: PDF generation from HTML
- **marked**: Markdown to HTML conversion
- **commander**: Command-line interface
- **chalk**: Terminal output styling
- **express**: Web server framework
- **multer**: File upload handling
- **cors**: Cross-origin resource sharing

## License

MIT License - Feel free to use this tool for personal and commercial projects.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the generation process
5. Submit a pull request

---

**Ready to create your professional CV?** Edit `template.md` and run `npm run generate template.md` to get started!