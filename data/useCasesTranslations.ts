export const FALLBACK_USE_CASES_TRANSLATIONS: Record<string, Record<number, string[]>> = {
  en: {
    100: ["When uploading large files in chunks", "In WebSockets to confirm handshake is in progress"],
    200: ["Standard response for successful HTTP requests", "Response to successful GET requests", "When an API request completes successfully"],
    201: ["After a POST request that creates a new resource", "When an item is successfully added to a database"],
    404: ["When a URL doesn't exist", "When a resource has been deleted", "To mask the existence of sensitive resources for security reasons"],
    500: ["When an unhandled exception occurs", "During a database connection failure", "When the server encounters an unexpected condition"]
  },
  es: {
    100: ["Al subir archivos grandes en fragmentos", "En WebSockets para confirmar que el apretón de manos está en progreso"],
    200: ["Respuesta estándar para solicitudes HTTP exitosas", "Respuesta a solicitudes GET exitosas", "Cuando una solicitud de API se completa exitosamente"],
    201: ["Después de una solicitud POST que crea un nuevo recurso", "Cuando un elemento se agrega exitosamente a una base de datos"],
    404: ["Cuando una URL no existe", "Cuando un recurso ha sido eliminado", "Para ocultar la existencia de recursos sensibles por razones de seguridad"],
    500: ["Cuando ocurre una excepción no manejada", "Durante una falla de conexión a la base de datos", "Cuando el servidor encuentra una condición inesperada"]
  },
  fr: {
    100: ["Lors du téléchargement de gros fichiers par morceaux", "Dans WebSockets pour confirmer que la poignée de main est en cours"],
    200: ["Réponse standard pour les requêtes HTTP réussies", "Réponse aux requêtes GET réussies", "Lorsqu'une requête API se termine avec succès"],
    201: ["Après une requête POST qui crée une nouvelle ressource", "Lorsqu'un élément est ajouté avec succès à une base de données"],
    404: ["Lorsqu'une URL n'existe pas", "Lorsqu'une ressource a été supprimée", "Pour masquer l'existence de ressources sensibles pour des raisons de sécurité"],
    500: ["Lorsqu'une exception non gérée se produit", "Lors d'une défaillance de connexion à la base de données", "Lorsque le serveur rencontre une condition inattendue"]
  },
  de: {
    100: ["Beim Hochladen großer Dateien in Chunks", "In WebSockets, um zu bestätigen, dass der Handshake läuft"],
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