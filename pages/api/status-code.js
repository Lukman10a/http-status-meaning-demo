// Import the package correctly from node_modules
import httpStatusMeaning from 'http-status-meaning';

// Safe wrapper for http status methods
const safeGetStatusMeaning = (code, language) => {
  try {
    return httpStatusMeaning?.getStatusMeaning(code, language) || `Status code ${code}`;
  } catch (e) {
    console.error("Error getting status meaning:", e);
    return `Status code ${code}`;
  }
};

const safeGetStatusCategory = (code, language) => {
  try {
    return httpStatusMeaning?.getStatusCategory(code, language) || "Unknown";
  } catch (e) {
    console.error("Error getting status category:", e);
    return "Unknown";
  }
};

const safeGetStatusCodeUseCases = (code) => {
  try {
    return httpStatusMeaning?.getStatusCodeUseCases(code) || [];
  } catch (e) {
    console.error("Error getting status code use cases:", e);
    return [];
  }
};

export default function handler(req, res) {
  try {
    const { code, language = 'en' } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Status code is required' });
    }
    
    const statusCode = parseInt(code, 10);
    if (isNaN(statusCode)) {
      return res.status(400).json({ error: 'Invalid status code format' });
    }
    
    const meaning = safeGetStatusMeaning(statusCode, language);
    const category = safeGetStatusCategory(statusCode, language);
    const useCases = safeGetStatusCodeUseCases(statusCode);
    
    res.status(200).json({
      code: statusCode,
      meaning,
      category,
      useCases,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 