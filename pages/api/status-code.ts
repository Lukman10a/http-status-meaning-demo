import { NextApiRequest, NextApiResponse } from 'next';
import httpStatusMeaning from 'http-status-meaning';

// Type assertion for the package since it doesn't have proper TypeScript definitions
const httpStatusMeaningTyped = httpStatusMeaning as any;

// Type definitions
interface StatusCodeResponse {
  code: number;
  meaning: string;
  category: string;
  useCases: string[];
}

interface ErrorResponse {
  error: string;
}

type ApiResponse = StatusCodeResponse | ErrorResponse;

// Safe wrapper for http status methods
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
    const { code, language = 'en' } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Status code is required' });
    }
    
    const statusCode = parseInt(code as string, 10);
    if (isNaN(statusCode)) {
      return res.status(400).json({ error: 'Invalid status code format' });
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