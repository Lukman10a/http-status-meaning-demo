// Import the package correctly from node_modules
import httpStatusMeaning from 'http-status-meaning';

// Safe wrapper for http status methods
const safeFindStatusCodeByDescription = (description) => {
  try {
    return httpStatusMeaning?.findStatusCodeByDescription(description) || null;
  } catch (e) {
    console.error("Error finding status code by description:", e);
    return null;
  }
};

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
    const { description, language = 'en' } = req.query;
    
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }
    
    const statusCode = safeFindStatusCodeByDescription(description);
    
    if (!statusCode) {
      return res.status(404).json({ error: 'No matching status code found' });
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