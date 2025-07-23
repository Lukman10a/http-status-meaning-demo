import { NextApiRequest, NextApiResponse } from 'next';
import httpStatusMeaning from 'http-status-meaning';

// Type assertion for the package since it doesn't have proper TypeScript definitions
const httpStatusMeaningTyped = httpStatusMeaning as any;

// Type definitions
interface DescriptionResponse {
  code: number;
  meaning: string;
  category: string;
  useCases: string[];
}

interface ErrorResponse {
  error: string;
}

type ApiResponse = DescriptionResponse | ErrorResponse;

// Safe wrapper for http status methods
const safeFindStatusCodeByDescription = (description: string): number | null => {
  try {
    return httpStatusMeaningTyped?.findStatusCodeByDescription(description) || null;
  } catch (e) {
    console.error("Error finding status code by description:", e);
    return null;
  }
};

const safeGetStatusMeaning = (code: number, language: string): string => {
  try {
    return httpStatusMeaningTyped?.getStatusMeaning(code, language) || `Status code ${code}`;
  } catch (e) {
    console.error("Error getting status meaning:", e);
    return `Status code ${code}`;
  }
};

const safeGetStatusCategory = (code: number, language: string): string => {
  try {
    return httpStatusMeaningTyped?.getStatusCategory(code, language) || "Unknown";
  } catch (e) {
    console.error("Error getting status category:", e);
    return "Unknown";
  }
};

const safeGetStatusCodeUseCases = (code: number): string[] => {
  try {
    return httpStatusMeaning?.getStatusCodeUseCases(code) || [];
  } catch (e) {
    console.error("Error getting status code use cases:", e);
    return [];
  }
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): void {
  try {
    const { description, language = 'en' } = req.query;
    
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }
    
    const statusCode = safeFindStatusCodeByDescription(description as string);
    
    if (!statusCode) {
      return res.status(404).json({ error: 'No matching status code found' });
    }
    
    const meaning = safeGetStatusMeaning(statusCode, language as string);
    const category = safeGetStatusCategory(statusCode, language as string);
    const useCases = safeGetStatusCodeUseCases(statusCode);
    
    res.status(200).json({
      code: statusCode,
      meaning,
      category,
      useCases,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
  }
} 