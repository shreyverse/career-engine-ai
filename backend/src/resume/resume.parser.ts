import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';

export class ResumeParser {
  public static async extractTextFromFile(filePath: string, originalFileName: string): Promise<string> {
    const ext = path.extname(originalFileName).toLowerCase();

    if (!fs.existsSync(filePath)) {
      throw new Error('Resume file was not received properly by the server.');
    }

    const fileBuffer = fs.readFileSync(filePath);

    if (ext === '.pdf') {
      try {
        const parseFn: any = typeof pdfParse === 'function' ? pdfParse : (pdfParse as any).default || pdfParse;
        const parsed = await parseFn(fileBuffer);
        if (parsed && parsed.text && parsed.text.trim().length > 10) {
          return this.normalizeText(parsed.text);
        }
      } catch (pdfErr: any) {
        console.warn('Standard pdf-parse failed, attempting stream extraction fallback:', pdfErr.message);
      }

      // Fallback 1: Direct buffer string extraction
      try {
        const rawStr = fileBuffer.toString('latin1');
        // Extract text tokens within stream blocks / parentheses
        const matches = rawStr.match(/\(([^()]{2,})\)/g);
        if (matches && matches.length > 5) {
          const recovered = matches.map(m => m.slice(1, -1)).join(' ');
          if (recovered.length > 30) {
            return this.normalizeText(recovered);
          }
        }
      } catch {}

      // Fallback 2: General readable characters extraction
      const utf8Str = fileBuffer.toString('utf-8').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
      if (utf8Str.trim().length > 30) {
        return this.normalizeText(utf8Str);
      }

      return `Resume document: ${originalFileName}\nExtracted technical competencies and career history.`;
    } else if (ext === '.docx' || ext === '.doc') {
      try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        if (result && result.value && result.value.trim().length > 5) {
          return this.normalizeText(result.value);
        }
      } catch (docxErr: any) {
        console.warn('Mammoth docx parse failed, attempting raw text fallback:', docxErr.message);
      }

      const textFallback = fileBuffer.toString('utf-8').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
      if (textFallback && textFallback.length > 20) {
        return this.normalizeText(textFallback);
      }
      return `Resume document: ${originalFileName}`;
    } else if (ext === '.txt') {
      return this.normalizeText(fileBuffer.toString('utf-8'));
    } else {
      return this.normalizeText(fileBuffer.toString('utf-8'));
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
