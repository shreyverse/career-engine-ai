import { CareerAnalysisData } from '../../types/careerAnalysis.types';
import { CareerAnalysisDataSchema } from '../schemas/careerAnalysis.schema';

export function parseAndValidateAIResponse(rawText: string): CareerAnalysisData {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('AI response is empty.');
  }

  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }

  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err: any) {
    throw new Error(`Failed to parse AI JSON response: ${err.message}`);
  }

  const validationResult = CareerAnalysisDataSchema.safeParse(parsed);
  if (!validationResult.success) {
    const errorDetails = validationResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    throw new Error(`AI response failed schema validation: ${errorDetails}`);
  }

  return validationResult.data as CareerAnalysisData;
}
