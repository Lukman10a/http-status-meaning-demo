export const FALLBACK_TRANSLATIONS: Record<string, Record<number, string>> = {
  en: {
    // Informational (100-199)
    100: "Continue - The server has received the request headers and the client should proceed to send the request body.",
    101: "Switching Protocols - The server is switching protocols as requested by the client.",
    102: "Processing - The server is processing the request but no response is available yet.",
    103: "Early Hints - Used to return some response headers before final HTTP message.",
    
    // Success (200-299)
    200: "OK - The request has succeeded.",
    201: "Created - The request has been fulfilled and resulted in a new resource being created.",
    202: "Accepted - The request has been accepted for processing, but the processing has not been completed.",
    204: "No Content - The server successfully processed the request and is not returning any content.",
    206: "Partial Content - The server is delivering only part of the resource due to a range header.",
    
    // Redirection (300-399)
    301: "Moved Permanently - The requested resource has been permanently moved to a new location.",
    302: "Found - The requested resource has been temporarily moved to a different location.",
    304: "Not Modified - The resource has not been modified since the last request.",
    307: "Temporary Redirect - The request should be repeated with another URI, but the client should continue to use the original URI.",
    308: "Permanent Redirect - The request and all future requests should be repeated using another URI.",
    
    // Client Errors (400-499)
    400: "Bad Request - The server cannot or will not process the request due to something that is perceived to be a client error.",
    401: "Unauthorized - The request has not been applied because it lacks valid authentication credentials.",
    403: "Forbidden - The server understood the request but refuses to authorize it.",
    404: "Not Found - The server cannot find the requested resource.",
    405: "Method Not Allowed - The method specified in the request is not allowed for the resource identified by the request URI.",
    409: "Conflict - The request could not be completed due to a conflict with the current state of the resource.",
    422: "Unprocessable Entity - The request was well-formed but was unable to be followed due to semantic errors.",
    429: "Too Many Requests - The user has sent too many requests in a given amount of time.",
    
    // Server Errors (500-599)
    500: "Internal Server Error - The server has encountered a situation it doesn't know how to handle.",
    501: "Not Implemented - The server does not support the functionality required to fulfill the request.",
    502: "Bad Gateway - The server received an invalid response from an upstream server.",
    503: "Service Unavailable - The server is not ready to handle the request.",
    504: "Gateway Timeout - The server acting as a gateway did not receive a timely response from an upstream server.",
    507: "Insufficient Storage - The server is unable to store the representation needed to complete the request."
  },
  es: {
    // Informational (100-199)
    100: "Continuar - El servidor ha recibido los encabezados de la solicitud y el cliente debe proceder a enviar el cuerpo de la solicitud.",
    101: "Cambiando Protocolos - El servidor está cambiando protocolos según lo solicitado por el cliente.",
    102: "Procesando - El servidor está procesando la solicitud pero aún no hay respuesta disponible.",
    103: "Pistas Tempranas - Se usa para devolver algunos encabezados de respuesta antes del mensaje HTTP final.",
    
    // Success (200-299)
    200: "OK - La solicitud ha tenido éxito.",
    201: "Creado - Se ha creado un nuevo recurso.",
    202: "Aceptado - La solicitud ha sido aceptada para procesamiento, pero el procesamiento no se ha completado.",
    204: "Sin Contenido - El servidor procesó exitosamente la solicitud y no está devolviendo ningún contenido.",
    206: "Contenido Parcial - El servidor está entregando solo una parte del recurso debido a un encabezado de rango.",
    
    // Redirection (300-399)
    301: "Movido Permanentemente - El recurso solicitado ha sido movido permanentemente a una nueva ubicación.",
    302: "Encontrado - El recurso solicitado ha sido movido temporalmente a una ubicación diferente.",
    304: "No Modificado - El recurso no ha sido modificado desde la última solicitud.",
    307: "Redirección Temporal - La solicitud debe repetirse con otro URI, pero el cliente debe continuar usando el URI original.",
    308: "Redirección Permanente - La solicitud y todas las solicitudes futuras deben repetirse usando otro URI.",
    
    // Client Errors (400-499)
    400: "Solicitud incorrecta - El servidor no puede procesar la solicitud debido a un error del cliente.",
    401: "No autorizado - Se requiere autenticación.",
    403: "Prohibido - El servidor entendió la solicitud, pero se niega a autorizarla.",
    404: "No encontrado - El servidor no puede encontrar el recurso solicitado.",
    405: "Método No Permitido - El método especificado en la solicitud no está permitido para el recurso identificado por el URI de la solicitud.",
    409: "Conflicto - La solicitud no pudo completarse debido a un conflicto con el estado actual del recurso.",
    422: "Entidad No Procesable - La solicitud estaba bien formada pero no se pudo seguir debido a errores semánticos.",
    429: "Demasiadas Solicitudes - El usuario ha enviado demasiadas solicitudes en un período de tiempo determinado.",
    
    // Server Errors (500-599)
    500: "Error interno del servidor - El servidor ha encontrado una situación que no sabe cómo manejar.",
    501: "No Implementado - El servidor no admite la funcionalidad requerida para cumplir con la solicitud.",
    502: "Puerta de Enlace Incorrecta - El servidor recibió una respuesta inválida de un servidor aguas arriba.",
    503: "Servicio no disponible - El servidor no está listo para manejar la solicitud.",
    504: "Tiempo de Espera de la Puerta de Enlace - El servidor que actúa como puerta de enlace no recibió una respuesta oportuna de un servidor aguas arriba.",
    507: "Almacenamiento Insuficiente - El servidor no puede almacenar la representación necesaria para completar la solicitud."
  },
  fr: {
    // Informational (100-199)
    100: "Continuer - Le serveur a reçu les en-têtes de la requête et le client doit procéder à l'envoi du corps de la requête.",
    101: "Changement de Protocoles - Le serveur change de protocoles selon la demande du client.",
    102: "Traitement - Le serveur traite la requête mais aucune réponse n'est encore disponible.",
    103: "Indications Précoces - Utilisé pour retourner certains en-têtes de réponse avant le message HTTP final.",
    
    // Success (200-299)
    200: "OK - La requête a réussi.",
    201: "Créé - Une nouvelle ressource a été créée.",
    202: "Accepté - La requête a été acceptée pour traitement, mais le traitement n'est pas terminé.",
    204: "Aucun Contenu - Le serveur a traité avec succès la requête et ne retourne aucun contenu.",
    206: "Contenu Partiel - Le serveur ne livre qu'une partie de la ressource en raison d'un en-tête de plage.",
    
    // Redirection (300-399)
    301: "Déplacé Permanemment - La ressource demandée a été déplacée définitivement vers un nouvel emplacement.",
    302: "Trouvé - La ressource demandée a été temporairement déplacée vers un emplacement différent.",
    304: "Non Modifié - La ressource n'a pas été modifiée depuis la dernière requête.",
    307: "Redirection Temporaire - La requête doit être répétée avec un autre URI, mais le client doit continuer à utiliser l'URI original.",
    308: "Redirection Permanente - La requête et toutes les requêtes futures doivent être répétées en utilisant un autre URI.",
    
    // Client Errors (400-499)
    400: "Requête Incorrecte - Le serveur ne peut pas traiter la requête en raison d'une erreur du client.",
    401: "Non Autorisé - L'authentification est requise.",
    403: "Interdit - Le serveur a compris la requête mais refuse de l'autoriser.",
    404: "Non Trouvé - Le serveur ne peut pas trouver la ressource demandée.",
    405: "Méthode Non Autorisée - La méthode spécifiée dans la requête n'est pas autorisée pour la ressource identifiée par l'URI de la requête.",
    409: "Conflit - La requête n'a pas pu être complétée en raison d'un conflit avec l'état actuel de la ressource.",
    422: "Entité Non Traitable - La requête était bien formée mais n'a pas pu être suivie en raison d'erreurs sémantiques.",
    429: "Trop de Requêtes - L'utilisateur a envoyé trop de requêtes dans un délai donné.",
    
    // Server Errors (500-599)
    500: "Erreur Interne du Serveur - Le serveur a rencontré une situation qu'il ne sait pas comment gérer.",
    501: "Non Implémenté - Le serveur ne prend pas en charge la fonctionnalité requise pour satisfaire la requête.",
    502: "Passerelle Incorrecte - Le serveur a reçu une réponse invalide d'un serveur en amont.",
    503: "Service Indisponible - Le serveur n'est pas prêt à traiter la requête.",
    504: "Délai d'Attente de Passerelle - Le serveur agissant comme passerelle n'a pas reçu de réponse en temps opportun d'un serveur en amont.",
    507: "Stockage Insuffisant - Le serveur ne peut pas stocker la représentation nécessaire pour compléter la requête."
  },
  de: {
    // Informational (100-199)
    100: "Weiter - Der Server hat die Anfrage-Header erhalten und der Client sollte mit dem Senden des Anfrage-Texts fortfahren.",
    101: "Protokollwechsel - Der Server wechselt Protokolle gemäß der Anfrage des Clients.",
    102: "Verarbeitung - Der Server verarbeitet die Anfrage, aber noch keine Antwort ist verfügbar.",
    103: "Frühe Hinweise - Wird verwendet, um einige Antwort-Header vor der endgültigen HTTP-Nachricht zurückzugeben.",
    
    // Success (200-299)
    200: "OK - Die Anfrage war erfolgreich.",
    201: "Erstellt - Eine neue Ressource wurde erstellt.",
    202: "Akzeptiert - Die Anfrage wurde zur Verarbeitung akzeptiert, aber die Verarbeitung ist noch nicht abgeschlossen.",
    204: "Kein Inhalt - Der Server hat die Anfrage erfolgreich verarbeitet und gibt keinen Inhalt zurück.",
    206: "Teilinhalt - Der Server liefert nur einen Teil der Ressource aufgrund eines Bereichs-Headers.",
    
    // Redirection (300-399)
    301: "Dauerhaft Verschoben - Die angeforderte Ressource wurde dauerhaft an einen neuen Standort verschoben.",
    302: "Gefunden - Die angeforderte Ressource wurde vorübergehend an einen anderen Standort verschoben.",
    304: "Nicht Geändert - Die Ressource wurde seit der letzten Anfrage nicht geändert.",
    307: "Temporäre Weiterleitung - Die Anfrage sollte mit einem anderen URI wiederholt werden, aber der Client sollte weiterhin den ursprünglichen URI verwenden.",
    308: "Dauerhafte Weiterleitung - Die Anfrage und alle zukünftigen Anfragen sollten mit einem anderen URI wiederholt werden.",
    
    // Client Errors (400-499)
    400: "Schlechte Anfrage - Der Server kann die Anfrage aufgrund eines Client-Fehlers nicht verarbeiten.",
    401: "Nicht Autorisiert - Authentifizierung ist erforderlich.",
    403: "Verboten - Der Server hat die Anfrage verstanden, weigert sich jedoch, sie zu autorisieren.",
    404: "Nicht Gefunden - Der Server kann die angeforderte Ressource nicht finden.",
    405: "Methode Nicht Erlaubt - Die in der Anfrage angegebene Methode ist für die durch die Anfrage-URI identifizierte Ressource nicht erlaubt.",
    409: "Konflikt - Die Anfrage konnte aufgrund eines Konflikts mit dem aktuellen Zustand der Ressource nicht abgeschlossen werden.",
    422: "Nicht Verarbeitbare Entität - Die Anfrage war gut geformt, konnte aber aufgrund semantischer Fehler nicht befolgt werden.",
    429: "Zu Viele Anfragen - Der Benutzer hat in einem bestimmten Zeitraum zu viele Anfragen gesendet.",
    
    // Server Errors (500-599)
    500: "Interner Serverfehler - Der Server ist auf eine Situation gestoßen, die er nicht zu bewältigen weiß.",
    501: "Nicht Implementiert - Der Server unterstützt nicht die Funktionalität, die zur Erfüllung der Anfrage erforderlich ist.",
    502: "Schlechte Gateway - Der Server hat eine ungültige Antwort von einem Upstream-Server erhalten.",
    503: "Dienst Nicht Verfügbar - Der Server ist nicht bereit, die Anfrage zu bearbeiten.",
    504: "Gateway-Timeout - Der als Gateway fungierende Server hat nicht rechtzeitig eine Antwort von einem Upstream-Server erhalten.",
    507: "Unzureichender Speicher - Der Server kann die Darstellung nicht speichern, die zur Vervollständigung der Anfrage erforderlich ist."
  },
  ar: {
    // Informational (100-199)
    100: "متابعة - استلم الخادم رؤوس الطلب ويجب على العميل المتابعة لإرسال جسم الطلب.",
    101: "تبديل البروتوكولات - يبدل الخادم البروتوكولات حسب طلب العميل.",
    102: "معالجة - يعالج الخادم الطلب ولكن لا توجد استجابة متاحة بعد.",
    103: "تلميحات مبكرة - تُستخدم لإرجاع بعض رؤوس الاستجابة قبل الرسالة النهائية HTTP.",
    
    // Success (200-299)
    200: "موافق - نجح الطلب.",
    201: "تم الإنشاء - تم إنشاء مورد جديد.",
    202: "مقبول - تم قبول الطلب للمعالجة، ولكن المعالجة لم تكتمل بعد.",
    204: "لا يوجد محتوى - عالج الخادم الطلب بنجاح ولا يرجع أي محتوى.",
    206: "محتوى جزئي - يقدم الخادم جزءاً فقط من المورد بسبب رأس النطاق.",
    
    // Redirection (300-399)
    301: "تم النقل بشكل دائم - تم نقل المورد المطلوب بشكل دائم إلى موقع جديد.",
    302: "تم العثور عليه - تم نقل المورد المطلوب مؤقتاً إلى موقع مختلف.",
    304: "لم يتم التعديل - لم يتم تعديل المورد منذ آخر طلب.",
    307: "إعادة توجيه مؤقتة - يجب تكرار الطلب مع URI آخر، ولكن يجب على العميل الاستمرار في استخدام URI الأصلي.",
    308: "إعادة توجيه دائمة - يجب تكرار الطلب وجميع الطلبات المستقبلية باستخدام URI آخر.",
    
    // Client Errors (400-499)
    400: "طلب سيء - لا يمكن للخادم معالجة الطلب بسبب خطأ في العميل.",
    401: "غير مصرح - مطلوب مصادقة.",
    403: "محظور - فهم الخادم الطلب لكنه يرفض تفويضه.",
    404: "غير موجود - لا يمكن للخادم العثور على المورد المطلوب.",
    405: "الطريقة غير مسموحة - الطريقة المحددة في الطلب غير مسموحة للمورد المحدد بواسطة URI الطلب.",
    409: "تضارب - لا يمكن إكمال الطلب بسبب تضارب مع الحالة الحالية للمورد.",
    422: "كيان غير قابل للمعالجة - كان الطلب منسقاً بشكل جيد لكن لا يمكن اتباعه بسبب أخطاء دلالية.",
    429: "طلبات كثيرة جداً - أرسل المستخدم طلبات كثيرة جداً في فترة زمنية معينة.",
    
    // Server Errors (500-599)
    500: "خطأ داخلي في الخادم - واجه الخادم موقفاً لا يعرف كيفية التعامل معه.",
    501: "غير مطبق - لا يدعم الخادم الوظيفة المطلوبة لتنفيذ الطلب.",
    502: "بوابة سيئة - استلم الخادم استجابة غير صالحة من خادم علوي.",
    503: "الخدمة غير متاحة - الخادم غير جاهز لمعالجة الطلب.",
    504: "انتهت مهلة البوابة - الخادم الذي يعمل كبوابة لم يستلم استجابة في الوقت المناسب من خادم علوي.",
    507: "تخزين غير كافٍ - لا يمكن للخادم تخزين التمثيل المطلوب لإكمال الطلب."
  },
  zh: {
    // Informational (100-199)
    100: "继续 - 服务器已收到请求头，客户端应继续发送请求体。",
    101: "切换协议 - 服务器正在按照客户端的要求切换协议。",
    102: "处理中 - 服务器正在处理请求，但还没有可用的响应。",
    103: "早期提示 - 用于在最终HTTP消息之前返回一些响应头。",
    
    // Success (200-299)
    200: "确定 - 请求已成功。",
    201: "已创建 - 已创建新资源。",
    202: "已接受 - 请求已被接受进行处理，但处理尚未完成。",
    204: "无内容 - 服务器成功处理了请求，不返回任何内容。",
    206: "部分内容 - 服务器由于范围头而只传递资源的一部分。",
    
    // Redirection (300-399)
    301: "永久移动 - 请求的资源已永久移动到新位置。",
    302: "找到 - 请求的资源已临时移动到不同位置。",
    304: "未修改 - 自上次请求以来资源未被修改。",
    307: "临时重定向 - 请求应该用另一个URI重复，但客户端应该继续使用原始URI。",
    308: "永久重定向 - 请求和所有未来请求应该使用另一个URI重复。",
    
    // Client Errors (400-499)
    400: "错误请求 - 服务器由于客户端错误而无法处理请求。",
    401: "未授权 - 需要身份验证。",
    403: "禁止 - 服务器理解请求但拒绝授权。",
    404: "未找到 - 服务器找不到请求的资源。",
    405: "方法不允许 - 请求中指定的方法不允许用于由请求URI标识的资源。",
    409: "冲突 - 由于与资源当前状态的冲突，无法完成请求。",
    422: "无法处理的实体 - 请求格式正确但由于语义错误而无法遵循。",
    429: "请求过多 - 用户在给定时间内发送了太多请求。",
    
    // Server Errors (500-599)
    500: "内部服务器错误 - 服务器遇到了不知道如何处理的情况。",
    501: "未实现 - 服务器不支持满足请求所需的功能。",
    502: "错误网关 - 服务器从上游服务器收到无效响应。",
    503: "服务不可用 - 服务器尚未准备好处理请求。",
    504: "网关超时 - 作为网关的服务器没有及时从上游服务器收到响应。",
    507: "存储不足 - 服务器无法存储完成请求所需的表示。"
  }
}; 