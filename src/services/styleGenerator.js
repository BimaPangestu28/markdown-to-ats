import { COLORS, FONT_SIZES, SPACING, FONTS, LAYOUT } from '../constants/styling.js';

/**
 * Service for generating professional ATS-friendly CSS styles
 */
export class StyleGeneratorService {
    /**
     * Generate complete CSS styles for the CV
     * 
     * @returns {string} Complete CSS stylesheet
     */
    static generateProfessionalStyles() {
        return `
            ${this._generateBaseStyles()}
            ${this._generateHeaderStyles()}
            ${this._generateSectionStyles()}
            ${this._generateTextStyles()}
            ${this._generateListStyles()}
            ${this._generateSpecialSectionStyles()}
            ${this._generatePrintStyles()}
            ${this._generateATSOptimizedStyles()}
        `;
    }

    /**
     * Generate base styles for the document
     * @private
     */
    static _generateBaseStyles() {
        return `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: ${FONTS.PRIMARY};
                font-size: ${FONT_SIZES.BODY_TEXT};
                line-height: ${LAYOUT.LINE_HEIGHT};
                color: ${COLORS.TEXT_MAIN};
                background: ${COLORS.BACKGROUND};
                max-width: ${LAYOUT.MAX_WIDTH};
                margin: 0 auto;
                padding: ${LAYOUT.PAGE_MARGIN};
            }
        `;
    }

    /**
     * Generate header and title styles
     * @private
     */
    static _generateHeaderStyles() {
        return `
            h1 {
                font-size: ${FONT_SIZES.MAIN_TITLE};
                font-weight: bold;
                color: ${COLORS.PRIMARY};
                margin-bottom: 5pt;
                text-align: center;
                border-bottom: ${SPACING.BORDER_WIDTH} solid ${COLORS.SECONDARY};
                padding-bottom: 8pt;
            }
            
            h2 {
                font-size: ${FONT_SIZES.SECTION_HEADER};
                font-weight: bold;
                color: ${COLORS.PRIMARY};
                margin-top: ${SPACING.SECTION_MARGIN_TOP};
                margin-bottom: ${SPACING.SECTION_MARGIN_BOTTOM};
                padding-bottom: 3pt;
                border-bottom: ${SPACING.THIN_BORDER} solid ${COLORS.BORDER};
                text-transform: uppercase;
                letter-spacing: 0.5pt;
            }
            
            h3 {
                font-size: ${FONT_SIZES.SUBSECTION_HEADER};
                font-weight: bold;
                color: ${COLORS.PRIMARY};
                margin-top: ${SPACING.SUBSECTION_MARGIN_TOP};
                margin-bottom: ${SPACING.SUBSECTION_MARGIN_BOTTOM};
            }
        `;
    }

    /**
     * Generate section-specific styles
     * @private
     */
    static _generateSectionStyles() {
        return `
            body > p:first-of-type {
                text-align: center;
                margin-bottom: 15pt;
                color: ${COLORS.TEXT_MUTED};
                font-size: ${FONT_SIZES.CONTACT_INFO};
            }
            
            h3 + p strong {
                color: ${COLORS.TEXT_LIGHT};
                font-weight: normal;
                font-style: italic;
            }
            
            hr {
                border: none;
                border-top: ${SPACING.THIN_BORDER} solid ${COLORS.BORDER_LIGHT};
                margin: 15pt 0;
            }
        `;
    }

    /**
     * Generate text and paragraph styles
     * @private
     */
    static _generateTextStyles() {
        return `
            p {
                margin-bottom: ${SPACING.PARAGRAPH_MARGIN};
                text-align: justify;
            }
            
            strong {
                font-weight: bold;
                color: ${COLORS.PRIMARY};
            }
            
            em {
                font-style: italic;
                color: ${COLORS.TEXT_LIGHT};
            }
        `;
    }

    /**
     * Generate list styles
     * @private
     */
    static _generateListStyles() {
        return `
            ul {
                margin-bottom: ${SPACING.LIST_MARGIN};
                padding-left: ${SPACING.LIST_PADDING};
            }
            
            li {
                margin-bottom: ${SPACING.LIST_ITEM_MARGIN};
                list-style-type: disc;
            }
        `;
    }

    /**
     * Generate special section styles
     * @private
     */
    static _generateSpecialSectionStyles() {
        return `
            h2:contains("Professional Summary") + p,
            h2:contains("Summary") + p {
                font-style: italic;
                background-color: ${COLORS.ACCENT_BACKGROUND};
                padding: 10pt;
                border-left: ${SPACING.ACCENT_BORDER} solid ${COLORS.SECONDARY};
                margin-bottom: 15pt;
            }
            
            h2:contains("Education") + h3,
            h2:contains("Certifications") + h3,
            h2:contains("Projects") + h3 {
                color: ${COLORS.SECONDARY};
            }
        `;
    }

    /**
     * Generate print-optimized styles
     * @private
     */
    static _generatePrintStyles() {
        return `
            @media print {
                body {
                    padding: ${LAYOUT.PRINT_MARGIN};
                    font-size: ${FONT_SIZES.PRINT_BODY};
                }
                
                h1 {
                    font-size: ${FONT_SIZES.PRINT_TITLE};
                }
                
                h2 {
                    font-size: ${FONT_SIZES.PRINT_SECTION};
                    page-break-after: avoid;
                }
                
                h3 {
                    font-size: ${FONT_SIZES.PRINT_SUBSECTION};
                    page-break-after: avoid;
                }
                
                p, li {
                    page-break-inside: avoid;
                }
                
                .page-break {
                    page-break-before: always;
                }
            }
        `;
    }

    /**
     * Generate ATS-friendly utility classes
     * @private
     */
    static _generateATSOptimizedStyles() {
        return `
            .contact-info {
                font-size: ${FONT_SIZES.CONTACT_INFO};
                text-align: center;
                margin-bottom: 15pt;
            }
            
            .section {
                margin-bottom: 20pt;
            }
            
            .job-title {
                font-weight: bold;
                color: ${COLORS.PRIMARY};
            }
            
            .company-info {
                color: ${COLORS.TEXT_LIGHT};
                font-style: italic;
                margin-bottom: 5pt;
            }
            
            .achievement {
                margin-left: 10pt;
            }
        `;
    }
}