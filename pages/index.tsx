import { useState, useEffect } from 'react';
import Head from 'next/head';
import httpStatusMeaning from "http-status-meaning";
import { 
  FALLBACK_TRANSLATIONS, 
  FALLBACK_CATEGORY_TRANSLATIONS, 
  FALLBACK_USE_CASES_TRANSLATIONS,
  UI_TRANSLATIONS 
} from '../data';

// Type assertion for the package since it doesn't have proper TypeScript definitions
const httpStatusMeaningTyped = httpStatusMeaning as any;

// Type definitions
interface StatusResult {
  code: number;
  meaning: string;
  category: string;
  useCases: string[];
}

interface ErrorResult {
  error: true;
  message: string;
}

type Result = StatusResult | ErrorResult | null;

interface SafeHttpStatus {
  getSupportedLanguages: () => string[];
  getStatusMeaning: (code: number, language?: string) => string;
  getStatusCategory: (code: number, language?: string) => string;
  getStatusCodeUseCases: (code: number, language?: string) => string[];
  findStatusCodeByDescription: (description: string) => number | null;
}

const SUPPORTED_LANGUAGES: string[] = ["en", "es", "fr", "de", "pt", "it", "ru", "zh", "ja", "ar"];

// Create a safe wrapper for the httpStatusMeaning functions with better language handling
const safeHttpStatus: SafeHttpStatus = {
  getSupportedLanguages: (): string[] => {
    console.log("Getting supported languages, httpStatusMeaning:", !!httpStatusMeaning);
    if (!httpStatusMeaning) return SUPPORTED_LANGUAGES;
    
    try {
      const languages = httpStatusMeaning.getSupportedLanguages();
      console.log("Languages retrieved from package:", languages);
      return languages && languages.length ? languages : SUPPORTED_LANGUAGES;
    } catch (e) {
      console.error("Error getting supported languages:", e);
      return SUPPORTED_LANGUAGES;
    }
  },
  getStatusMeaning: (code: number, language: string = 'en'): string => {
    // Force language to lowercase for consistency
    const lang = language?.toLowerCase() || 'en';
    console.log(`getStatusMeaning called with code: ${code}, language: ${lang}`);

    // Default to English if undefined language
    if (!lang || lang === 'undefined') {
      console.log("Language undefined, defaulting to en");
      return safeHttpStatus.getStatusMeaning(code, 'en');
    }
    
    // If no httpStatusMeaning package available
    if (!httpStatusMeaning) {
      console.log("httpStatusMeaning not available, using fallback");
      // Check if we have a fallback translation for this language and code
      if (FALLBACK_TRANSLATIONS[lang]?.[code]) {
        return FALLBACK_TRANSLATIONS[lang][code];
      }
      
      // Fall back to English
      return FALLBACK_TRANSLATIONS.en[code] || `Status code ${code}`;
    }
    
    try {
      // Attempt to get meaning from package
      console.log(`Calling httpStatusMeaning.getStatusMeaning(${code}, ${lang})`);
      const meaning = httpStatusMeaningTyped.getStatusMeaning(code, lang);
      console.log("Status meaning from package:", meaning);
      
      // If we didn't get a valid meaning or it contains "Unknown", use fallback
      if (!meaning || meaning.includes("Unknown")) {
        console.log("Using fallback meaning");
        if (FALLBACK_TRANSLATIONS[lang]?.[code]) {
          return FALLBACK_TRANSLATIONS[lang][code];
        }
        return FALLBACK_TRANSLATIONS.en[code] || `Status code ${code}`;
      }
      
      return meaning;
    } catch (e) {
      console.error("Error getting status meaning:", e);
      if (FALLBACK_TRANSLATIONS[lang]?.[code]) {
        return FALLBACK_TRANSLATIONS[lang][code];
      }
      return FALLBACK_TRANSLATIONS.en[code] || `Status code ${code}`;
    }
  },
  getStatusCategory: (code: number, language: string = 'en'): string => {
    // Force language to lowercase for consistency
    const lang = language?.toLowerCase() || 'en';
    console.log(`getStatusCategory called with code: ${code}, language: ${lang}`);
    
    // Default to English if undefined language
    if (!lang || lang === 'undefined') {
      console.log("Language undefined, defaulting to en");
      return safeHttpStatus.getStatusCategory(code, 'en');
    }
    
    // Determine the category based on code range
    let category: string;
    if (code >= 100 && code < 200) category = "Informational";
    else if (code >= 200 && code < 300) category = "Success";
    else if (code >= 300 && code < 400) category = "Redirection";
    else if (code >= 400 && code < 500) category = "Client Error";
    else if (code >= 500 && code < 600) category = "Server Error";
    else category = "Unknown";
    
    // If we don't have the package, use fallback
    if (!httpStatusMeaning) {
      console.log("httpStatusMeaning not available, using fallback category");
      if (FALLBACK_CATEGORY_TRANSLATIONS[lang]?.[category]) {
        return FALLBACK_CATEGORY_TRANSLATIONS[lang][category];
      }
      return FALLBACK_CATEGORY_TRANSLATIONS.en[category] || category;
    }
    
    try {
      // Attempt to get category from package
      console.log(`Calling httpStatusMeaning.getStatusCategory(${code}, ${lang})`);
      const categoryTranslation = httpStatusMeaningTyped.getStatusCategory(code, lang);
      console.log("Status category from package:", categoryTranslation);
      
      // If we didn't get a valid category, use fallback
      if (!categoryTranslation || categoryTranslation.includes("Unknown")) {
        console.log("Using fallback category");
        if (FALLBACK_CATEGORY_TRANSLATIONS[lang]?.[category]) {
          return FALLBACK_CATEGORY_TRANSLATIONS[lang][category];
        }
        return FALLBACK_CATEGORY_TRANSLATIONS.en[category] || category;
      }
      
      return categoryTranslation;
    } catch (e) {
      console.error("Error getting status category:", e);
      if (FALLBACK_CATEGORY_TRANSLATIONS[lang]?.[category]) {
        return FALLBACK_CATEGORY_TRANSLATIONS[lang][category];
      }
      return FALLBACK_CATEGORY_TRANSLATIONS.en[category] || category;
    }
  },
  getStatusCodeUseCases: (code: number, language: string = 'en'): string[] => {
    // Force language to lowercase for consistency
    const lang = language?.toLowerCase() || 'en';
    console.log(`getStatusCodeUseCases called with code: ${code}, language: ${lang}`);
    
    // Default to English if undefined language
    if (!lang || lang === 'undefined') {
      console.log("Language undefined, defaulting to en");
      return safeHttpStatus.getStatusCodeUseCases(code, 'en');
    }
    
    // Check if we have translated use cases for this language and code
    const hasTranslations = FALLBACK_USE_CASES_TRANSLATIONS[lang] &&
      FALLBACK_USE_CASES_TRANSLATIONS[lang][code];
    
    if (hasTranslations) {
      console.log("Using translated use cases");
      return FALLBACK_USE_CASES_TRANSLATIONS[lang][code];
    }
    
    // If no httpStatusMeaning package available, use English fallback
    if (!httpStatusMeaning) {
      console.log("httpStatusMeaning not available, using fallback use cases");
      return FALLBACK_USE_CASES_TRANSLATIONS.en[code] || [];
    }
    
    try {
      // Attempt to get use cases from package
      console.log(`Calling httpStatusMeaning.getStatusCodeUseCases(${code}, ${lang})`);
      const useCases = httpStatusMeaningTyped.getStatusCodeUseCases(code, lang);
      console.log("Use cases from package:", useCases);
      
      // If we got valid use cases, return them
      if (useCases && Array.isArray(useCases) && useCases.length > 0) {
        return useCases;
      }
      
      // Otherwise, try to get English use cases from package
      console.log("No use cases in requested language, trying English");
      const englishUseCases = httpStatusMeaningTyped.getStatusCodeUseCases(code, 'en');
      if (englishUseCases && Array.isArray(englishUseCases) && englishUseCases.length > 0) {
        return englishUseCases;
      }
      
      // Finally, use fallback
      console.log("Using fallback use cases");
      return FALLBACK_USE_CASES_TRANSLATIONS.en[code] || [];
    } catch (e) {
      console.error("Error getting use cases:", e);
      return FALLBACK_USE_CASES_TRANSLATIONS.en[code] || [];
    }
  },
  findStatusCodeByDescription: (description: string): number | null => {
    console.log(`findStatusCodeByDescription called with description: ${description}`);
    
    if (!httpStatusMeaning) {
      console.log("httpStatusMeaning not available, using fallback search");
      // Simple fallback search through English translations
      for (const [code, meaning] of Object.entries(FALLBACK_TRANSLATIONS.en)) {
        if (meaning.toLowerCase().includes(description.toLowerCase())) {
          return parseInt(code);
        }
      }
      return null;
    }
    
    try {
      console.log("Calling httpStatusMeaning.findStatusCodeByDescription");
      const code = httpStatusMeaningTyped.findStatusCodeByDescription(description);
      console.log("Status code from package:", code);
      return code;
    } catch (e) {
      console.error("Error finding status code by description:", e);
      // Fallback search through English translations
      for (const [code, meaning] of Object.entries(FALLBACK_TRANSLATIONS.en)) {
        if (meaning.toLowerCase().includes(description.toLowerCase())) {
          return parseInt(code);
        }
      }
      return null;
    }
  }
};

// Helper function to get UI text in the selected language
function getUIText(key: string, language: string): string {
  const lang = language?.toLowerCase() || 'en';
  return UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS.en[key] || key;
}

export default function Home(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'status' | 'description'>('status');
  const [statusCode, setStatusCode] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
  const [result, setResult] = useState<Result>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [clientSide, setClientSide] = useState<boolean>(false);

  useEffect(() => {
    setClientSide(true);
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // If we have a result, update it with the new language
    if (result && !('error' in result)) {
      const updatedResult: StatusResult = {
        code: result.code,
        meaning: safeHttpStatus.getStatusMeaning(result.code, newLanguage),
        category: safeHttpStatus.getStatusCategory(result.code, newLanguage),
        useCases: safeHttpStatus.getStatusCodeUseCases(result.code, newLanguage)
      };
      setResult(updatedResult);
    }
  };

  const handleStatusCodeLookup = (): void => {
    const code = parseInt(statusCode);
    
    if (isNaN(code) || code < 100 || code > 599) {
      setResult({
        error: true,
        message: getUIText('invalidStatusCode', language)
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        const meaning = safeHttpStatus.getStatusMeaning(code, language);
        const category = safeHttpStatus.getStatusCategory(code, language);
        const useCases = safeHttpStatus.getStatusCodeUseCases(code, language);
        
        setResult({
          code,
          meaning,
          category,
          useCases
        });
      } catch (error) {
        setResult({
          error: true,
          message: getUIText('errorMessage', language)
        });
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleDescriptionLookup = (): void => {
    if (!description.trim()) {
      setResult({
        error: true,
        message: getUIText('invalidDescription', language)
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        const code = safeHttpStatus.findStatusCodeByDescription(description);
        
        if (code === null) {
          setResult({
            error: true,
            message: getUIText('noResults', language)
          });
          return;
        }
        
        const meaning = safeHttpStatus.getStatusMeaning(code, language);
        const category = safeHttpStatus.getStatusCategory(code, language);
        const useCases = safeHttpStatus.getStatusCodeUseCases(code, language);
        
        setResult({
          code,
          meaning,
          category,
          useCases
        });
      } catch (error) {
        setResult({
          error: true,
          message: getUIText('errorMessage', language)
        });
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const getStatusCodeColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'informational':
        return 'from-blue-500 to-blue-600';
      case 'success':
        return 'from-green-500 to-green-600';
      case 'redirection':
        return 'from-teal-500 to-teal-600';
      case 'client error':
        return 'from-brand-500 to-brand-600';
      case 'server error':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getLanguageName = (code: string): string => {
    const languageNames: Record<string, string> = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      ar: 'العربية',
      zh: '中文'
    };
    return languageNames[code] || code.toUpperCase();
  };

  return (
    <>
      <Head>
        <title>HTTP Status Code Lookup</title>
        <meta name="description" content="Find the meaning and use cases of any HTTP status code" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8 animate-slideInUp">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-600 mb-4">
              {getUIText('title', language)}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              {getUIText('subtitle', language)}
            </p>
          </div>

          {/* Language Selector */}
          {clientSide && (
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2">
                <label htmlFor="language" className="text-gray-700 font-medium">
                  {getUIText('languageLabel', language)}
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ar">العربية</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="max-w-4xl mx-auto">
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab('status')}
                className={`px-6 py-3 font-medium text-lg transition-colors ${
                  activeTab === 'status'
                    ? 'text-brand-600 border-b-2 border-brand-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {getUIText('statusCodeTab', language)}
              </button>
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 font-medium text-lg transition-colors ${
                  activeTab === 'description'
                    ? 'text-brand-600 border-b-2 border-brand-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {getUIText('descriptionTab', language)}
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              {activeTab === 'status' ? (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="statusCode" className="block text-lg font-medium text-gray-700 mb-2">
                      {getUIText('statusCodeLabel', language)}
                    </label>
                    <input
                      type="number"
                      id="statusCode"
                      value={statusCode}
                      onChange={(e) => setStatusCode(e.target.value)}
                      placeholder={getUIText('statusCodePlaceholder', language)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-lg"
                      min="100"
                      max="599"
                    />
                  </div>
                  <button
                    onClick={handleStatusCodeLookup}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? '...' : getUIText('lookupButton', language)}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
                      {getUIText('descriptionLabel', language)}
                    </label>
                    <input
                      type="text"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={getUIText('descriptionPlaceholder', language)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-lg"
                    />
                  </div>
                  <button
                    onClick={handleDescriptionLookup}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? '...' : getUIText('lookupButton', language)}
                  </button>
                </div>
              )}

              {/* Results */}
              {result && (
                <div className="mt-8 pt-8 border-t border-gray-200 animate-slideInUp">
                  {'error' in result ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700">{result.message}</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Status Code Badge */}
                      <div className="flex items-center space-x-4">
                        <div className={`bg-gradient-to-r ${getStatusCodeColor(result.category)} text-white px-6 py-3 rounded-full font-bold text-2xl`}>
                          {result.code}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{result.meaning}</h3>
                          <p className="text-gray-600">{getUIText('categoryLabel', language)}: {result.category}</p>
                        </div>
                      </div>

                      {/* Use Cases */}
                      {result.useCases && result.useCases.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-3">
                            {getUIText('useCasesLabel', language)}:
                          </h4>
                          <ul className="space-y-2">
                            {result.useCases.map((useCase, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-brand-500 mt-1">•</span>
                                <span className="text-gray-700">{useCase}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 