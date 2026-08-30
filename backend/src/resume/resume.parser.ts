import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';

export class ResumeParser {
  public static async extractTextFromFile(filePath: string, originalFileName: string): Promise<string> {
    const ext = path.extname(originalFileName).toLowerCase();

    if (!fs.existsSync(filePath)) {
      throw new Error('Resume file not found on server.');
    }

    const fileBuffer = fs.readFileSync(filePath);

    if (ext === '.pdf') {
      try {
        const parseFn: any = typeof pdfParse === 'function' ? pdfParse : (pdfParse as any).default || pdfParse;
        const parsed = await parseFn(fileBuffer);
        return this.normalizeText(parsed.text);
      } catch (pdfErr) {
        const textFallback = fileBuffer.toString('utf-8');
        if (textFallback && textFallback.length > 20) {
          return this.normalizeText(textFallback);
        }
        throw new Error('Failed to parse PDF document.');
      }
    } else if (ext === '.docx' || ext === '.doc') {
      try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return this.normalizeText(result.value);
      } catch (docxErr) {
        const textFallback = fileBuffer.toString('utf-8');
        if (textFallback && textFallback.length > 20) {
          return this.normalizeText(textFallback);
        }
        throw new Error('Failed to parse DOCX document.');
      }
    } else if (ext === '.txt') {
      return this.normalizeText(fileBuffer.toString('utf-8'));
    } else {
      throw new Error('Unsupported document format. Please provide a PDF or DOCX file.');
    }
  }

  public static normalizeText(rawText: string): string {
    if (!rawText) return '';
    return rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/[^\S\r\n]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}
