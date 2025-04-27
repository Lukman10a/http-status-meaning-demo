import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import httpStatusMeaning from "http-status-meaning";

// Fixed status code use cases data for fallback
const FALLBACK_USE_CASES = {
  100: ["When uploading large files in chunks", "In WebSockets to confirm a handshake is in progress"],
  200: ["Standard response for successful HTTP requests", "Response to successful GET requests", "When an API request completes successfully"],
  201: ["After a POST request that creates a new resource", "When an item is successfully added to a database"],
  204: ["After a successful DELETE operation", "When submitting a form that should not navigate away"],
  301: ["When a website has moved permanently to a new domain", "Redirecting from old URLs to new URLs for SEO purposes"],
  302: ["Temporary redirects during maintenance", "After a successful form submission to redirect to a confirmation page"],
  400: ["When form validation fails", "When request parameters are missing or invalid", "When the JSON payload is malformed"],
  401: ["When a user tries to access a resource without logging in", "When an API key is missing or invalid"],
  403: ["When a user is logged in but lacks permission for a resource", "When IP-based restrictions prevent access"],
  404: ["When a URL doesn't exist", "When a resource has been deleted", "To mask the existence of sensitive resources for security"],
  429: ["When rate limits have been exceeded", "To prevent brute force attacks"],
  500: ["When an unhandled exception occurs", "During database connection failure", "When the server encounters an unexpected condition"],
  502: ["When a proxy or load balancer can't reach the upstream server", "During server deployment or restart"],
  503: ["During scheduled maintenance", "When the server is overloaded", "When a service is temporarily unavailable due to high traffic"]
};

// Define a list of supported languages as fallback
const SUPPORTED_LANGUAGES = ["en", "es", "fr", "de", "pt", "it", "ru", "zh", "ja", "ar"];

// Add language translations fallback for common status code meanings
const FALLBACK_TRANSLATIONS = {
  en: {
    200: "OK - The request has succeeded.",
    201: "Created - The request has been fulfilled and resulted in a new resource being created.",
    400: "Bad Request - The server cannot or will not process the request due to something that is perceived to be a client error.",
    401: "Unauthorized - The request has not been applied because it lacks valid authentication credentials.",
    403: "Forbidden - The server understood the request but refuses to authorize it.",
    404: "Not Found - The server cannot find the requested resource.",
    500: "Internal Server Error - The server has encountered a situation it doesn't know how to handle.",
    503: "Service Unavailable - The server is not ready to handle the request."
  },
  es: {
    200: "OK - La solicitud ha tenido éxito.",
    201: "Creado - Se ha creado un nuevo recurso.",
    400: "Solicitud incorrecta - El servidor no puede procesar la solicitud debido a un error del cliente.",
    401: "No autorizado - Se requiere autenticación.",
    403: "Prohibido - El servidor entendió la solicitud, pero se niega a autorizarla.",
    404: "No encontrado - El servidor no puede encontrar el recurso solicitado.",
    500: "Error interno del servidor - El servidor ha encontrado una situación que no sabe cómo manejar.",
    503: "Servicio no disponible - El servidor no está disponible temporalmente."
  },
  fr: {
    200: "OK - La requête a réussi.",
    201: "Créé - Une nouvelle ressource a été créée.",
    400: "Mauvaise demande - Le serveur ne peut pas traiter la demande en raison d'une erreur client.",
    401: "Non autorisé - L'authentification est nécessaire.",
    403: "Interdit - Le serveur a compris la demande mais refuse de l'autoriser.",
    404: "Non trouvé - Le serveur ne peut pas trouver la ressource demandée.",
    500: "Erreur interne du serveur - Le serveur a rencontré une situation qu'il ne sait pas gérer.",
    503: "Service indisponible - Le serveur est temporairement indisponible."
  },
  de: {
    200: "OK - Die Anfrage war erfolgreich.",
    201: "Erstellt - Eine neue Ressource wurde erstellt.",
    400: "Fehlerhafte Anfrage - Der Server kann die Anfrage aufgrund eines Client-Fehlers nicht verarbeiten.",
    401: "Nicht autorisiert - Authentifizierung ist erforderlich.",
    403: "Verboten - Der Server hat die Anfrage verstanden, weigert sich jedoch, sie zu autorisieren.",
    404: "Nicht gefunden - Der Server kann die angeforderte Ressource nicht finden.",
    500: "Interner Serverfehler - Der Server hat eine Situation angetroffen, mit der er nicht umgehen kann.",
    503: "Dienst nicht verfügbar - Der Server ist vorübergehend nicht verfügbar."
  },
  pt: {
    200: "OK - A solicitação foi bem-sucedida.",
    404: "Não encontrado - O servidor não pode encontrar o recurso solicitado.",
    500: "Erro interno do servidor - O servidor encontrou uma situação que não sabe como lidar."
  },
  it: {
    200: "OK - La richiesta è stata completata con successo.",
    404: "Non trovato - Il server non riesce a trovare la risorsa richiesta.",
    500: "Errore interno del server - Il server ha riscontrato una situazione che non sa come gestire."
  },
  ru: {
    200: "OK - Запрос выполнен успешно.",
    404: "Не найдено - Сервер не может найти запрашиваемый ресурс.",
    500: "Внутренняя ошибка сервера - Сервер столкнулся с ситуацией, с которой он не знает, как справиться."
  },
  zh: {
    200: "成功 - 请求成功。",
    404: "未找到 - 服务器找不到请求的资源。",
    500: "服务器内部错误 - 服务器遇到了一个不知如何处理的情况。"
  },
  ja: {
    200: "OK - リクエストは成功しました。",
    404: "見つかりません - サーバーは要求されたリソースを見つけることができません。",
    500: "サーバー内部エラー - サーバーは処理方法がわからない状況に遭遇しました。"
  },
  ar: {
    200: "تم - نجح الطلب.",
    404: "غير موجود - لا يمكن للخادم العثور على المورد المطلوب.",
    500: "خطأ داخلي في الخادم - واجه الخادم موقفًا لا يعرف كيفية التعامل معه."
  }
};

// Add category translations fallback
const FALLBACK_CATEGORY_TRANSLATIONS = {
  en: {
    "Informational": "Informational",
    "Success": "Success",
    "Redirection": "Redirection",
    "Client Error": "Client Error",
    "Server Error": "Server Error",
    "Unknown": "Unknown"
  },
  es: {
    "Informational": "Informativo",
    "Success": "Éxito",
    "Redirection": "Redirección",
    "Client Error": "Error del Cliente",
    "Server Error": "Error del Servidor",
    "Unknown": "Desconocido"
  },
  fr: {
    "Informational": "Information",
    "Success": "Succès",
    "Redirection": "Redirection",
    "Client Error": "Erreur Client",
    "Server Error": "Erreur Serveur",
    "Unknown": "Inconnu"
  },
  de: {
    "Informational": "Information",
    "Success": "Erfolg",
    "Redirection": "Umleitung",
    "Client Error": "Client-Fehler",
    "Server Error": "Server-Fehler",
    "Unknown": "Unbekannt"
  }
};

// Add translated use cases for different languages
const FALLBACK_USE_CASES_TRANSLATIONS = {
  en: {
    100: ["When uploading large files in chunks", "In WebSockets to confirm a handshake is in progress"],
    200: ["Standard response for successful HTTP requests", "Response to successful GET requests", "When an API request completes successfully"],
    201: ["After a POST request that creates a new resource", "When an item is successfully added to a database"],
    404: ["When a URL doesn't exist", "When a resource has been deleted", "To mask the existence of sensitive resources for security"],
    500: ["When an unhandled exception occurs", "During database connection failure", "When the server encounters an unexpected condition"]
  },
  es: {
    100: ["Al cargar archivos grandes en fragmentos", "En WebSockets para confirmar que un protocolo de enlace está en progreso"],
    200: ["Respuesta estándar para solicitudes HTTP exitosas", "Respuesta a solicitudes GET exitosas", "Cuando una solicitud de API se completa con éxito"],
    201: ["Después de una solicitud POST que crea un nuevo recurso", "Cuando un elemento se agrega con éxito a una base de datos"],
    404: ["Cuando una URL no existe", "Cuando un recurso ha sido eliminado", "Para enmascarar la existencia de recursos sensibles por seguridad"],
    500: ["Cuando ocurre una excepción no controlada", "Durante un fallo de conexión a la base de datos", "Cuando el servidor encuentra una condición inesperada"]
  },
  fr: {
    100: ["Lors du téléchargement de gros fichiers par morceaux", "Dans WebSockets pour confirmer qu'une liaison est en cours"],
    200: ["Réponse standard pour les requêtes HTTP réussies", "Réponse aux requêtes GET réussies", "Lorsqu'une requête API se termine avec succès"],
    201: ["Après une requête POST qui crée une nouvelle ressource", "Lorsqu'un élément est ajouté avec succès à une base de données"],
    404: ["Lorsqu'une URL n'existe pas", "Lorsqu'une ressource a été supprimée", "Pour masquer l'existence de ressources sensibles pour la sécurité"],
    500: ["Lorsqu'une exception non gérée se produit", "Lors d'une défaillance de connexion à la base de données", "Lorsque le serveur rencontre une condition inattendue"]
  },
  de: {
    100: ["Beim Hochladen großer Dateien in Teilen", "In WebSockets zur Bestätigung, dass ein Handshake im Gange ist"],
    200: ["Standardantwort für erfolgreiche HTTP-Anfragen", "Antwort auf erfolgreiche GET-Anfragen", "Wenn eine API-Anfrage erfolgreich abgeschlossen wird"],
    201: ["Nach einer POST-Anfrage, die eine neue Ressource erstellt", "Wenn ein Element erfolgreich einer Datenbank hinzugefügt wird"],
    404: ["Wenn eine URL nicht existiert", "Wenn eine Ressource gelöscht wurde", "Um die Existenz sensibler Ressourcen aus Sicherheitsgründen zu maskieren"],
    500: ["Wenn eine nicht behandelte Ausnahme auftritt", "Bei einem Datenbankverbindungsfehler", "Wenn der Server auf eine unerwartete Bedingung stößt"]
  },
  ar: {
    100: ["عند تحميل ملفات كبيرة على دفعات", "في بروتوكول WebSockets لتأكيد أن المصافحة قيد التقدم"],
    200: ["استجابة قياسية لطلبات HTTP الناجحة", "استجابة لطلبات GET الناجحة", "عندما تكتمل طلب API بنجاح"],
    201: ["بعد طلب POST الذي ينشئ مورداً جديداً", "عند إضافة عنصر بنجاح إلى قاعدة بيانات"],
    404: ["عندما لا يوجد URL", "عندما تم حذف مورد", "لإخفاء وجود موارد حساسة للأمان"],
    500: ["عند حدوث استثناء غير معالج", "أثناء فشل الاتصال بقاعدة البيانات", "عندما يواجه الخادم حالة غير متوقعة"]
  },
  zh: {
    100: ["当分块上传大文件时", "在WebSockets中确认握手正在进行"],
    200: ["成功HTTP请求的标准响应", "对成功GET请求的响应", "当API请求成功完成时"],
    201: ["在创建新资源的POST请求之后", "当项目成功添加到数据库时"],
    404: ["当URL不存在时", "当资源已被删除时", "出于安全原因掩盖敏感资源的存在"],
    500: ["当发生未处理的异常时", "在数据库连接失败期间", "当服务器遇到意外情况时"]
  }
};

// Create a safe wrapper for the httpStatusMeaning functions with better language handling
const safeHttpStatus = {
  getSupportedLanguages: () => {
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
  getStatusMeaning: (code, language = 'en') => {
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
      const meaning = httpStatusMeaning.getStatusMeaning(code, lang);
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
  getStatusCategory: (code, language = 'en') => {
    // Force language to lowercase for consistency
    const lang = language?.toLowerCase() || 'en';
    console.log(`getStatusCategory called with code: ${code}, language: ${lang}`);
    
    // Default to English if undefined language
    if (!lang || lang === 'undefined') {
      console.log("Language undefined, defaulting to en");
      return safeHttpStatus.getStatusCategory(code, 'en');
    }
    
    // Determine the category based on code range
    let category;
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
      const categoryTranslation = httpStatusMeaning.getStatusCategory(code, lang);
      console.log("Status category from package:", categoryTranslation);
      
      // If we didn't get a valid category, use fallback
      if (!categoryTranslation) {
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
  getStatusCodeUseCases: (code, language = 'en') => {
    // Force language to lowercase for consistency
    const lang = language?.toLowerCase() || 'en';
    console.log(`getStatusCodeUseCases called with code: ${code}, language: ${lang}`);
    
    // Check if we have translations for this language
    const hasTranslations = FALLBACK_USE_CASES_TRANSLATIONS[lang] && 
                           FALLBACK_USE_CASES_TRANSLATIONS[lang][code];
    
    // If httpStatusMeaning package is not available or we have no translated use cases
    if (!httpStatusMeaning) {
      console.log("httpStatusMeaning not available, using fallback use cases");
      
      // Return translated use cases if available, otherwise English
      if (hasTranslations) {
        return FALLBACK_USE_CASES_TRANSLATIONS[lang][code];
      }
      return FALLBACK_USE_CASES_TRANSLATIONS.en[code] || [];
    }
    
    try {
      // Attempt to get use cases from package
      console.log(`Calling httpStatusMeaning.getStatusCodeUseCases(${code})`);
      const useCases = httpStatusMeaning.getStatusCodeUseCases(code);
      console.log("Use cases from package:", useCases);
      
      // If we got valid use cases but need them in another language
      if (useCases && useCases.length && lang !== 'en' && hasTranslations) {
        console.log("Returning translated use cases for", lang);
        return FALLBACK_USE_CASES_TRANSLATIONS[lang][code];
      }
      
      // If we got valid use cases in English, return them
      if (useCases && useCases.length) {
        console.log("Using package use cases");
        return useCases;
      }
      
      // Otherwise use our fallback
      console.log("Using fallback use cases");
      if (hasTranslations) {
        return FALLBACK_USE_CASES_TRANSLATIONS[lang][code];
      }
      return FALLBACK_USE_CASES_TRANSLATIONS.en[code] || [];
    } catch (e) {
      console.error("Error getting status code use cases:", e);
      
      // Return translated use cases if available, otherwise English
      if (hasTranslations) {
        return FALLBACK_USE_CASES_TRANSLATIONS[lang][code];
      }
      return FALLBACK_USE_CASES_TRANSLATIONS.en[code] || [];
    }
  },
  findStatusCodeByDescription: (description) => {
    if (!httpStatusMeaning) {
      // Simple fallback for common descriptions
      const lowerDesc = description.toLowerCase();
      if (lowerDesc.includes("not found")) return 404;
      if (lowerDesc.includes("ok") || lowerDesc === "success") return 200;
      if (lowerDesc.includes("bad request")) return 400;
      if (lowerDesc.includes("unauthorized")) return 401;
      if (lowerDesc.includes("forbidden")) return 403;
      if (lowerDesc.includes("server error")) return 500;
      return null;
    }
    
    try {
      return httpStatusMeaning.findStatusCodeByDescription(description) || null;
    } catch (e) {
      console.error("Error finding status code by description:", e);
      return null;
    }
  }
};

// Add UI text translations
const UI_TEXT_TRANSLATIONS = {
  en: {
    commonUseCases: "Common Use Cases:",
    category: "Category:"
  },
  es: {
    commonUseCases: "Casos de Uso Comunes:",
    category: "Categoría:"
  },
  fr: {
    commonUseCases: "Cas d'Utilisation Courants:",
    category: "Catégorie:"
  },
  de: {
    commonUseCases: "Häufige Anwendungsfälle:",
    category: "Kategorie:"
  },
  pt: {
    commonUseCases: "Casos de Uso Comuns:",
    category: "Categoria:"
  },
  it: {
    commonUseCases: "Casi d'Uso Comuni:",
    category: "Categoria:"
  },
  ru: {
    commonUseCases: "Распространенные случаи использования:",
    category: "Категория:"
  },
  zh: {
    commonUseCases: "常见用例:",
    category: "类别:"
  },
  ja: {
    commonUseCases: "一般的な使用例:",
    category: "カテゴリー:"
  },
  ar: {
    commonUseCases: "حالات الاستخدام الشائعة:",
    category: "الفئة:"
  }
};

// Add a helper function to get UI text
function getUIText(key, language) {
  const lang = language?.toLowerCase() || 'en';
  if (UI_TEXT_TRANSLATIONS[lang] && UI_TEXT_TRANSLATIONS[lang][key]) {
    return UI_TEXT_TRANSLATIONS[lang][key];
  }
  return UI_TEXT_TRANSLATIONS.en[key];
}

export default function Home() {
  const [statusCode, setStatusCode] = useState('404');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('lookup');
  const [result, setResult] = useState(null);
  const [clientSide, setClientSide] = useState(false);
  const [languages, setLanguages] = useState(["en"]);

  // Setup client-side data after component mounts
  useEffect(() => {
    setClientSide(true);
    const supportedLangs = safeHttpStatus.getSupportedLanguages();
    console.log("Supported languages:", supportedLangs);
    setLanguages(supportedLangs);
    
    // Set default result for 404
    if (!result) {
      const code = 404;
      const initialResult = {
        code,
        meaning: safeHttpStatus.getStatusMeaning(code, language),
        category: safeHttpStatus.getStatusCategory(code, language),
        useCases: safeHttpStatus.getStatusCodeUseCases(code, language),
      };
      console.log("Setting initial result:", initialResult);
      setResult(initialResult);
    }
  }, []);

  // Handle language change directly
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    console.log("Language changed from", language, "to", newLanguage);
    setLanguage(newLanguage);
    
    // Update result immediately if we have a current result
    if (result && !result.error) {
      const code = result.code;
      console.log("Updating result for language change. Code:", code, "New language:", newLanguage);
      
      // Get updated translations for the new language
      const updatedMeaning = safeHttpStatus.getStatusMeaning(code, newLanguage);
      const updatedCategory = safeHttpStatus.getStatusCategory(code, newLanguage);
      const updatedUseCases = safeHttpStatus.getStatusCodeUseCases(code, newLanguage);
      
      console.log("Updated meaning:", updatedMeaning);
      console.log("Updated category:", updatedCategory);
      console.log("Updated use cases:", updatedUseCases);
      
      const updatedResult = {
        ...result,
        meaning: updatedMeaning,
        category: updatedCategory,
        useCases: updatedUseCases,
      };
      
      console.log("Updated result:", updatedResult);
      setResult(updatedResult);
    }
  };

  const handleStatusCodeLookup = () => {
    try {
      const code = parseInt(statusCode, 10);
      if (isNaN(code)) {
        setResult({
          error: true,
          message: 'Please enter a valid HTTP status code'
        });
        return;
      }

      // Load the use cases directly
      const useCases = safeHttpStatus.getStatusCodeUseCases(code, language);
      console.log("Use cases for code", code, "with language", language, ":", useCases);
      
      // Create the final result object
      const finalResult = {
        code,
        meaning: safeHttpStatus.getStatusMeaning(code, language),
        category: safeHttpStatus.getStatusCategory(code, language),
        useCases,
      };
      
      console.log("Setting result for code lookup:", finalResult);
      setResult(finalResult);
    } catch (error) {
      console.error("Error in handleStatusCodeLookup:", error);
      setResult({
        error: true,
        message: error.message
      });
    }
  };

  const handleDescriptionLookup = () => {
    try {
      if (!description.trim()) {
        setResult({
          error: true,
          message: 'Please enter a description'
        });
        return;
      }

      const code = safeHttpStatus.findStatusCodeByDescription(description);
      console.log("Found code for description:", description, ":", code);
      
      if (!code) {
        setResult({
          error: true,
          message: 'No matching status code found for this description'
        });
        return;
      }

      // Load the use cases directly
      const useCases = safeHttpStatus.getStatusCodeUseCases(code, language);
      console.log("Use cases for code", code, "with language", language, ":", useCases);
      
      // Create the final result object
      const finalResult = {
        code,
        meaning: safeHttpStatus.getStatusMeaning(code, language),
        category: safeHttpStatus.getStatusCategory(code, language),
        useCases,
      };
      
      console.log("Setting result for description lookup:", finalResult);
      setResult(finalResult);
    } catch (error) {
      console.error("Error in handleDescriptionLookup:", error);
      setResult({
        error: true,
        message: error.message
      });
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Informational': '#0066cc',
      'Success': '#4caf50',
      'Redirection': '#00bcd4',
      'Client Error': '#ff9800',
      'Server Error': '#f44336',
      'Unknown': '#9e9e9e'
    };
    return colors[category] || colors['Unknown'];
  };

  // Language name mapping for display
  const getLanguageName = (code) => {
    const names = {
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'pt': 'Português',
      'it': 'Italiano',
      'ru': 'Русский',
      'zh': '中文',
      'ja': '日本語',
      'ar': 'العربية'
    };
    return names[code] || code.toUpperCase();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>HTTP Status Meaning Demo</title>
        <meta name="description" content="Demo for HTTP Status Meaning package" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          HTTP Status Meaning
        </h1>

        <p className={styles.description}>
          A comprehensive library for HTTP status codes with internationalization support
        </p>

        <div className={styles.tabs}>
          <button 
            className={activeTab === 'lookup' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('lookup')}
          >
            Status Code Lookup
          </button>
          <button 
            className={activeTab === 'description' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('description')}
          >
            Description Lookup
          </button>
        </div>

        <div className={styles.card}>
          {activeTab === 'lookup' ? (
            <div className={styles.formGroup}>
              <label htmlFor="statusCode">HTTP Status Code:</label>
              <input
                id="statusCode"
                type="text"
                value={statusCode}
                onChange={(e) => setStatusCode(e.target.value)}
                placeholder="e.g. 404"
                className={styles.input}
              />
              <div className={styles.formGroup}>
                <label htmlFor="language">Language:</label>
                <select
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className={styles.select}
                >
                  {clientSide && languages.map(lang => (
                    <option key={lang} value={lang}>{getLanguageName(lang)}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleStatusCodeLookup}
                className={styles.button}
              >
                Lookup
              </button>
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label htmlFor="description">Description:</label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Not Found"
                className={styles.input}
              />
              <div className={styles.formGroup}>
                <label htmlFor="language">Language:</label>
                <select
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className={styles.select}
                >
                  {clientSide && languages.map(lang => (
                    <option key={lang} value={lang}>{getLanguageName(lang)}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleDescriptionLookup}
                className={styles.button}
              >
                Find Status Code
              </button>
            </div>
          )}
        </div>

        {result && (
          <div className={styles.resultContainer}>
            {result.error ? (
              <div className={styles.error}>{result.message}</div>
            ) : (
              <>
                <div className={styles.resultHeader}>
                  <div 
                    className={styles.statusCode}
                    style={{ backgroundColor: getCategoryColor(result.category) }}
                  >
                    {result.code}
                  </div>
                  <h2 className={styles.statusMeaning}>{result.meaning}</h2>
                </div>
                <div className={styles.statusCategory}>
                  {getUIText('category', language)} <span style={{ color: getCategoryColor(result.category) }}>{result.category}</span>
                </div>
                {result.useCases && result.useCases.length > 0 && (
                  <div className={styles.useCases}>
                    <h3>{getUIText('commonUseCases', language)}</h3>
                    <ul>
                      {result.useCases.map((useCase, index) => (
                        <li key={index}>{useCase}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/Lukman10a/http-status-meaning"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  );
} 