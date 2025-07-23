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

// Comprehensive status code use cases data for fallback
const FALLBACK_USE_CASES: Record<number, string[]> = {
  // Informational (100-199)
  100: [
    "When uploading large files in chunks",
    "In WebSockets to confirm a handshake is in progress",
    "For real-time communication protocols"
  ],
  101: [
    "When switching protocols (HTTP to WebSocket)",
    "For protocol upgrade requests",
    "In real-time applications requiring bidirectional communication"
  ],
  102: [
    "For long-running processes",
    "When processing takes significant time",
    "To prevent client timeout during heavy operations"
  ],
  103: [
    "For early hints in resource loading",
    "To preload critical resources",
    "For performance optimization in web applications"
  ],

  // Success (200-299)
  200: [
    "Standard response for successful HTTP requests",
    "Response to successful GET requests",
    "When an API request completes successfully",
    "For successful data retrieval operations"
  ],
  201: [
    "After a POST request that creates a new resource",
    "When an item is successfully added to a database",
    "For successful user registration",
    "When a new file is uploaded successfully"
  ],
  202: [
    "When a request is accepted for processing",
    "For asynchronous operations",
    "When a task is queued for background processing",
    "For batch operations that take time to complete"
  ],
  204: [
    "After a successful DELETE operation",
    "When submitting a form that should not navigate away",
    "For successful operations that don't return content",
    "When updating a resource without returning the updated data"
  ],
  206: [
    "For partial content responses",
    "When streaming video or audio content",
    "For resume-able downloads",
    "When serving large files in chunks"
  ],

  // Redirection (300-399)
  301: [
    "When a website has moved permanently to a new domain",
    "Redirecting from old URLs to new URLs for SEO purposes",
    "For permanent URL changes",
    "When consolidating multiple domains"
  ],
  302: [
    "Temporary redirects during maintenance",
    "After a successful form submission to redirect to a confirmation page",
    "For temporary URL changes",
    "When redirecting to a login page"
  ],
  304: [
    "When content hasn't changed (caching)",
    "For conditional requests with valid cache",
    "To reduce bandwidth usage",
    "For static resource optimization"
  ],
  307: [
    "For temporary redirects that preserve the HTTP method",
    "When maintaining POST data during redirects",
    "For safe temporary redirects",
    "When preserving request body in redirects"
  ],
  308: [
    "For permanent redirects that preserve the HTTP method",
    "When permanently changing URLs while keeping HTTP method",
    "For permanent redirects with request body preservation",
    "When consolidating APIs permanently"
  ],

  // Client Errors (400-499)
  400: [
    "When form validation fails",
    "When request parameters are missing or invalid",
    "When the JSON payload is malformed",
    "For syntax errors in request data"
  ],
  401: [
    "When a user tries to access a resource without logging in",
    "When an API key is missing or invalid",
    "For expired authentication tokens",
    "When credentials are required but not provided"
  ],
  403: [
    "When a user is logged in but lacks permission for a resource",
    "When IP-based restrictions prevent access",
    "For forbidden file access",
    "When user role doesn't have required permissions"
  ],
  404: [
    "When a URL doesn't exist",
    "When a resource has been deleted",
    "To mask the existence of sensitive resources for security",
    "For missing API endpoints"
  ],
  405: [
    "When using the wrong HTTP method",
    "For endpoints that don't support certain methods",
    "When trying to POST to a GET-only endpoint",
    "For method not allowed errors"
  ],
  409: [
    "When creating a resource that already exists",
    "For duplicate email addresses during registration",
    "When concurrent modifications conflict",
    "For resource conflict scenarios"
  ],
  422: [
    "When request is well-formed but semantically incorrect",
    "For validation errors in request data",
    "When business logic validation fails",
    "For unprocessable entity errors"
  ],
  429: [
    "When rate limits have been exceeded",
    "To prevent brute force attacks",
    "For API usage limits",
    "When too many requests are made in a short time"
  ],

  // Server Errors (500-599)
  500: [
    "When an unhandled exception occurs",
    "During database connection failure",
    "When the server encounters an unexpected condition",
    "For internal server errors"
  ],
  501: [
    "When the server doesn't support the requested functionality",
    "For unimplemented HTTP methods",
    "When a feature is not yet available",
    "For not implemented server capabilities"
  ],
  502: [
    "When a proxy or load balancer can't reach the upstream server",
    "During server deployment or restart",
    "When backend services are down",
    "For bad gateway errors"
  ],
  503: [
    "During scheduled maintenance",
    "When the server is overloaded",
    "When a service is temporarily unavailable due to high traffic",
    "For service unavailable scenarios"
  ],
  504: [
    "When a gateway timeout occurs",
    "When upstream servers take too long to respond",
    "For timeout errors in proxy servers",
    "When backend services are slow"
  ],
  507: [
    "When server storage is insufficient",
    "For disk space issues",
    "When quota limits are exceeded",
    "For insufficient storage errors"
  ]
};

// Define a list of supported languages as fallback
const SUPPORTED_LANGUAGES: string[] = ["en", "es", "fr", "de", "pt", "it", "ru", "zh", "ja", "ar"];

// Fallback translations are now imported from data/fallbackTranslations.ts
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
    400: "Mauvaise demande - Le serveur ne peut pas traiter la demande en raison d'une erreur client.",
    401: "Non autorisé - L'authentification est nécessaire.",
    403: "Interdit - Le serveur a compris la demande mais refuse de l'autoriser.",
    404: "Non trouvé - Le serveur ne peut pas trouver la ressource demandée.",
    405: "Méthode Non Autorisée - La méthode spécifiée dans la requête n'est pas autorisée pour la ressource identifiée par l'URI de la requête.",
    409: "Conflit - La requête n'a pas pu être complétée en raison d'un conflit avec l'état actuel de la ressource.",
    422: "Entité Non Traitable - La requête était bien formée mais n'a pas pu être suivie en raison d'erreurs sémantiques.",
    429: "Trop de Requêtes - L'utilisateur a envoyé trop de requêtes dans un délai donné.",
    
    // Server Errors (500-599)
    500: "Erreur interne du serveur - Le serveur a rencontré une situation qu'il ne sait pas gérer.",
    501: "Non Implémenté - Le serveur ne prend pas en charge la fonctionnalité requise pour satisfaire la requête.",
    502: "Mauvaise Passerelle - Le serveur a reçu une réponse invalide d'un serveur en amont.",
    503: "Service indisponible - Le serveur n'est pas prêt à traiter la requête.",
    504: "Délai d'Attente de la Passerelle - Le serveur agissant comme passerelle n'a pas reçu de réponse en temps opportun d'un serveur en amont.",
    507: "Stockage Insuffisant - Le serveur ne peut pas stocker la représentation nécessaire pour compléter la requête."
  },
  de: {
    // Informational (100-199)
    100: "Weiter - Der Server hat die Anfrage-Header erhalten und der Client sollte mit dem Senden des Anfrage-Texts fortfahren.",
    101: "Protokollwechsel - Der Server wechselt Protokolle wie vom Client angefordert.",
    102: "Verarbeitung - Der Server verarbeitet die Anfrage, aber noch keine Antwort ist verfügbar.",
    103: "Frühe Hinweise - Wird verwendet, um einige Antwort-Header vor der endgültigen HTTP-Nachricht zurückzugeben.",
    
    // Success (200-299)
    200: "OK - Die Anfrage war erfolgreich.",
    201: "Erstellt - Eine neue Ressource wurde erstellt.",
    202: "Akzeptiert - Die Anfrage wurde zur Verarbeitung akzeptiert, aber die Verarbeitung ist noch nicht abgeschlossen.",
    204: "Kein Inhalt - Der Server hat die Anfrage erfolgreich verarbeitet und gibt keinen Inhalt zurück.",
    206: "Teilinhalt - Der Server liefert nur einen Teil der Ressource aufgrund eines Bereich-Headers.",
    
    // Redirection (300-399)
    301: "Permanent verschoben - Die angeforderte Ressource wurde dauerhaft an einen neuen Standort verschoben.",
    302: "Gefunden - Die angeforderte Ressource wurde vorübergehend an einen anderen Standort verschoben.",
    304: "Nicht geändert - Die Ressource wurde seit der letzten Anfrage nicht geändert.",
    307: "Temporäre Weiterleitung - Die Anfrage sollte mit einem anderen URI wiederholt werden, aber der Client sollte den ursprünglichen URI weiterhin verwenden.",
    308: "Permanente Weiterleitung - Die Anfrage und alle zukünftigen Anfragen sollten mit einem anderen URI wiederholt werden.",
    
    // Client Errors (400-499)
    400: "Fehlerhafte Anfrage - Der Server kann die Anfrage aufgrund eines Client-Fehlers nicht verarbeiten.",
    401: "Nicht autorisiert - Authentifizierung ist erforderlich.",
    403: "Verboten - Der Server hat die Anfrage verstanden, weigert sich jedoch, sie zu autorisieren.",
    404: "Nicht gefunden - Der Server kann die angeforderte Ressource nicht finden.",
    405: "Methode nicht erlaubt - Die in der Anfrage angegebene Methode ist für die durch die Anfrage-URI identifizierte Ressource nicht erlaubt.",
    409: "Konflikt - Die Anfrage konnte aufgrund eines Konflikts mit dem aktuellen Zustand der Ressource nicht abgeschlossen werden.",
    422: "Nicht verarbeitbare Entität - Die Anfrage war gut geformt, konnte aber aufgrund semantischer Fehler nicht befolgt werden.",
    429: "Zu viele Anfragen - Der Benutzer hat in einem bestimmten Zeitraum zu viele Anfragen gesendet.",
    
    // Server Errors (500-599)
    500: "Interner Serverfehler - Der Server hat eine Situation angetroffen, mit der er nicht umgehen kann.",
    501: "Nicht implementiert - Der Server unterstützt nicht die Funktionalität, die zur Erfüllung der Anfrage erforderlich ist.",
    502: "Schlechte Gateway - Der Server hat eine ungültige Antwort von einem Upstream-Server erhalten.",
    503: "Dienst nicht verfügbar - Der Server ist nicht bereit, die Anfrage zu bearbeiten.",
    504: "Gateway-Timeout - Der als Gateway fungierende Server hat keine rechtzeitige Antwort von einem Upstream-Server erhalten.",
    507: "Unzureichender Speicher - Der Server kann die Darstellung nicht speichern, die zur Vervollständigung der Anfrage erforderlich ist."
  },
  pt: {
    // Informational (100-199)
    100: "Continuar - O servidor recebeu os cabeçalhos da solicitação e o cliente deve prosseguir para enviar o corpo da solicitação.",
    101: "Mudando Protocolos - O servidor está mudando protocolos conforme solicitado pelo cliente.",
    102: "Processando - O servidor está processando a solicitação, mas ainda não há resposta disponível.",
    103: "Dicas Antecipadas - Usado para retornar alguns cabeçalhos de resposta antes da mensagem HTTP final.",
    
    // Success (200-299)
    200: "OK - A solicitação foi bem-sucedida.",
    201: "Criado - Um novo recurso foi criado.",
    202: "Aceito - A solicitação foi aceita para processamento, mas o processamento não foi concluído.",
    204: "Sem Conteúdo - O servidor processou com sucesso a solicitação e não está retornando nenhum conteúdo.",
    206: "Conteúdo Parcial - O servidor está entregando apenas uma parte do recurso devido a um cabeçalho de intervalo.",
    
    // Redirection (300-399)
    301: "Movido Permanentemente - O recurso solicitado foi movido permanentemente para um novo local.",
    302: "Encontrado - O recurso solicitado foi movido temporariamente para um local diferente.",
    304: "Não Modificado - O recurso não foi modificado desde a última solicitação.",
    307: "Redirecionamento Temporário - A solicitação deve ser repetida com outro URI, mas o cliente deve continuar usando o URI original.",
    308: "Redirecionamento Permanente - A solicitação e todas as solicitações futuras devem ser repetidas usando outro URI.",
    
    // Client Errors (400-499)
    400: "Solicitação Incorreta - O servidor não pode ou não processará a solicitação devido a algo que é percebido como um erro do cliente.",
    401: "Não Autorizado - A solicitação não foi aplicada porque carece de credenciais de autenticação válidas.",
    403: "Proibido - O servidor entendeu a solicitação, mas se recusa a autorizá-la.",
    404: "Não encontrado - O servidor não pode encontrar o recurso solicitado.",
    405: "Método Não Permitido - O método especificado na solicitação não é permitido para o recurso identificado pelo URI da solicitação.",
    409: "Conflito - A solicitação não pôde ser concluída devido a um conflito com o estado atual do recurso.",
    422: "Entidade Não Processável - A solicitação estava bem formada, mas não pôde ser seguida devido a erros semânticos.",
    429: "Muitas Solicitações - O usuário enviou muitas solicitações em um determinado período de tempo.",
    
    // Server Errors (500-599)
    500: "Erro interno do servidor - O servidor encontrou uma situação que não sabe como lidar.",
    501: "Não Implementado - O servidor não suporta a funcionalidade necessária para atender à solicitação.",
    502: "Gateway Ruim - O servidor recebeu uma resposta inválida de um servidor upstream.",
    503: "Serviço Indisponível - O servidor não está pronto para lidar com a solicitação.",
    504: "Timeout do Gateway - O servidor atuando como gateway não recebeu uma resposta oportuna de um servidor upstream.",
    507: "Armazenamento Insuficiente - O servidor não pode armazenar a representação necessária para completar a solicitação."
  },
  it: {
    // Informational (100-199)
    100: "Continua - Il server ha ricevuto gli header della richiesta e il client deve procedere a inviare il corpo della richiesta.",
    101: "Cambio Protocolli - Il server sta cambiando protocolli come richiesto dal client.",
    102: "Elaborazione - Il server sta elaborando la richiesta ma non è ancora disponibile una risposta.",
    103: "Suggerimenti Anticipati - Utilizzato per restituire alcuni header di risposta prima del messaggio HTTP finale.",
    
    // Success (200-299)
    200: "OK - La richiesta è stata completata con successo.",
    201: "Creato - Una nuova risorsa è stata creata.",
    202: "Accettato - La richiesta è stata accettata per l'elaborazione, ma l'elaborazione non è stata completata.",
    204: "Nessun Contenuto - Il server ha elaborato con successo la richiesta e non restituisce alcun contenuto.",
    206: "Contenuto Parziale - Il server sta fornendo solo una parte della risorsa a causa di un header di intervallo.",
    
    // Redirection (300-399)
    301: "Spostato Permanentemente - La risorsa richiesta è stata spostata permanentemente in una nuova posizione.",
    302: "Trovato - La risorsa richiesta è stata spostata temporaneamente in una posizione diversa.",
    304: "Non Modificato - La risorsa non è stata modificata dall'ultima richiesta.",
    307: "Reindirizzamento Temporaneo - La richiesta deve essere ripetuta con un altro URI, ma il client deve continuare a utilizzare l'URI originale.",
    308: "Reindirizzamento Permanente - La richiesta e tutte le richieste future devono essere ripetute utilizzando un altro URI.",
    
    // Client Errors (400-499)
    400: "Richiesta Non Valida - Il server non può o non elaborerà la richiesta a causa di qualcosa che è percepito come un errore del client.",
    401: "Non Autorizzato - La richiesta non è stata applicata perché manca di credenziali di autenticazione valide.",
    403: "Vietato - Il server ha compreso la richiesta ma si rifiuta di autorizzarla.",
    404: "Non trovato - Il server non riesce a trovare la risorsa richiesta.",
    405: "Metodo Non Consentito - Il metodo specificato nella richiesta non è consentito per la risorsa identificata dall'URI della richiesta.",
    409: "Conflitto - La richiesta non ha potuto essere completata a causa di un conflitto con lo stato attuale della risorsa.",
    422: "Entità Non Elaborabile - La richiesta era ben formata ma non ha potuto essere seguita a causa di errori semantici.",
    429: "Troppe Richieste - L'utente ha inviato troppe richieste in un determinato periodo di tempo.",
    
    // Server Errors (500-599)
    500: "Errore interno del server - Il server ha riscontrato una situazione che non sa come gestire.",
    501: "Non Implementato - Il server non supporta la funzionalità richiesta per soddisfare la richiesta.",
    502: "Gateway Non Valido - Il server ha ricevuto una risposta non valida da un server upstream.",
    503: "Servizio Non Disponibile - Il server non è pronto a gestire la richiesta.",
    504: "Timeout del Gateway - Il server che agisce come gateway non ha ricevuto una risposta tempestiva da un server upstream.",
    507: "Memoria Insufficiente - Il server non può memorizzare la rappresentazione necessaria per completare la richiesta."
  },
  ru: {
    // Informational (100-199)
    100: "Продолжить - Сервер получил заголовки запроса, и клиент должен продолжить отправку тела запроса.",
    101: "Переключение протоколов - Сервер переключает протоколы по запросу клиента.",
    102: "Обработка - Сервер обрабатывает запрос, но ответ еще недоступен.",
    103: "Ранние подсказки - Используется для возврата некоторых заголовков ответа перед финальным HTTP-сообщением.",
    
    // Success (200-299)
    200: "OK - Запрос выполнен успешно.",
    201: "Создано - Новый ресурс был создан.",
    202: "Принято - Запрос был принят для обработки, но обработка еще не завершена.",
    204: "Нет содержимого - Сервер успешно обработал запрос и не возвращает никакого содержимого.",
    206: "Частичное содержимое - Сервер доставляет только часть ресурса из-за заголовка диапазона.",
    
    // Redirection (300-399)
    301: "Перемещено навсегда - Запрашиваемый ресурс был навсегда перемещен в новое место.",
    302: "Найдено - Запрашиваемый ресурс был временно перемещен в другое место.",
    304: "Не изменено - Ресурс не был изменен с момента последнего запроса.",
    307: "Временное перенаправление - Запрос должен быть повторен с другим URI, но клиент должен продолжать использовать исходный URI.",
    308: "Постоянное перенаправление - Запрос и все будущие запросы должны быть повторены с использованием другого URI.",
    
    // Client Errors (400-499)
    400: "Плохой запрос - Сервер не может или не будет обрабатывать запрос из-за того, что воспринимается как ошибка клиента.",
    401: "Не авторизован - Запрос не был применен, поскольку ему не хватает действительных учетных данных аутентификации.",
    403: "Запрещено - Сервер понял запрос, но отказывается его авторизовать.",
    404: "Не найдено - Сервер не может найти запрашиваемый ресурс.",
    405: "Метод не разрешен - Метод, указанный в запросе, не разрешен для ресурса, идентифицированного URI запроса.",
    409: "Конфликт - Запрос не мог быть завершен из-за конфликта с текущим состоянием ресурса.",
    422: "Неподдающаяся обработке сущность - Запрос был хорошо сформирован, но не мог быть выполнен из-за семантических ошибок.",
    429: "Слишком много запросов - Пользователь отправил слишком много запросов за определенный период времени.",
    
    // Server Errors (500-599)
    500: "Внутренняя ошибка сервера - Сервер столкнулся с ситуацией, с которой он не знает, как справиться.",
    501: "Не реализовано - Сервер не поддерживает функциональность, необходимую для выполнения запроса.",
    502: "Плохой шлюз - Сервер получил недействительный ответ от вышестоящего сервера.",
    503: "Служба недоступна - Сервер не готов обрабатывать запрос.",
    504: "Тайм-аут шлюза - Сервер, действующий как шлюз, не получил своевременный ответ от вышестоящего сервера.",
    507: "Недостаточно места - Сервер не может сохранить представление, необходимое для завершения запроса."
  },
  zh: {
    // Informational (100-199)
    100: "继续 - 服务器已收到请求头，客户端应继续发送请求体。",
    101: "切换协议 - 服务器正在根据客户端请求切换协议。",
    102: "处理中 - 服务器正在处理请求，但尚未有响应可用。",
    103: "早期提示 - 用于在最终HTTP消息之前返回一些响应头。",
    
    // Success (200-299)
    200: "成功 - 请求成功。",
    201: "已创建 - 请求已实现，并创建了新的资源。",
    202: "已接受 - 请求已接受处理，但处理尚未完成。",
    204: "无内容 - 服务器成功处理了请求，但不返回任何内容。",
    206: "部分内容 - 服务器由于范围头而只传递资源的一部分。",
    
    // Redirection (300-399)
    301: "永久移动 - 请求的资源已永久移动到新位置。",
    302: "找到 - 请求的资源已临时移动到不同位置。",
    304: "未修改 - 资源自上次请求以来未修改。",
    307: "临时重定向 - 请求应使用另一个URI重复，但客户端应继续使用原始URI。",
    308: "永久重定向 - 请求和所有未来请求应使用另一个URI重复。",
    
    // Client Errors (400-499)
    400: "错误请求 - 服务器由于被认为是客户端错误而无法或不会处理请求。",
    401: "未授权 - 请求未应用，因为它缺少有效的身份验证凭据。",
    403: "禁止 - 服务器理解了请求，但拒绝授权它。",
    404: "未找到 - 服务器找不到请求的资源。",
    405: "方法不允许 - 请求中指定的方法不允许用于由请求URI标识的资源。",
    409: "冲突 - 由于与资源当前状态的冲突，请求无法完成。",
    422: "无法处理的实体 - 请求格式正确，但由于语义错误而无法遵循。",
    429: "请求过多 - 用户在给定时间内发送了太多请求。",
    
    // Server Errors (500-599)
    500: "服务器内部错误 - 服务器遇到了一个不知如何处理的情况。",
    501: "未实现 - 服务器不支持满足请求所需的功能。",
    502: "错误网关 - 服务器从上游服务器收到无效响应。",
    503: "服务不可用 - 服务器尚未准备好处理请求。",
    504: "网关超时 - 充当网关的服务器未从上游服务器收到及时响应。",
    507: "存储空间不足 - 服务器无法存储完成请求所需的表示。"
  },
  ja: {
    // Informational (100-199)
    100: "続行 - サーバーはリクエストヘッダーを受信し、クライアントはリクエストボディの送信を続行する必要があります。",
    101: "プロトコル切り替え - サーバーはクライアントの要求に応じてプロトコルを切り替えています。",
    102: "処理中 - サーバーはリクエストを処理していますが、まだ応答が利用できません。",
    103: "早期ヒント - 最終的なHTTPメッセージの前に一部の応答ヘッダーを返すために使用されます。",
    
    // Success (200-299)
    200: "OK - リクエストは成功しました。",
    201: "作成済み - 新しいリソースが作成されました。",
    202: "受理済み - リクエストは処理のために受理されましたが、処理はまだ完了していません。",
    204: "コンテンツなし - サーバーはリクエストを正常に処理し、コンテンツを返しません。",
    206: "部分コンテンツ - サーバーは範囲ヘッダーによりリソースの一部のみを配信しています。",
    
    // Redirection (300-399)
    301: "恒久的に移動 - 要求されたリソースは新しい場所に恒久的に移動されました。",
    302: "発見 - 要求されたリソースは一時的に別の場所に移動されました。",
    304: "未変更 - リソースは最後のリクエスト以降変更されていません。",
    307: "一時的リダイレクト - リクエストは別のURIで繰り返される必要がありますが、クライアントは元のURIを引き続き使用する必要があります。",
    308: "恒久的リダイレクト - リクエストとすべての将来のリクエストは別のURIを使用して繰り返される必要があります。",
    
    // Client Errors (400-499)
    400: "不正なリクエスト - サーバーはクライアントエラーと認識されるものによりリクエストを処理できません。",
    401: "認証が必要 - リクエストは有効な認証資格情報が不足しているため適用されませんでした。",
    403: "禁止 - サーバーはリクエストを理解しましたが、承認を拒否します。",
    404: "見つかりません - サーバーは要求されたリソースを見つけることができません。",
    405: "メソッド許可されていません - リクエストで指定されたメソッドは、リクエストURIで識別されるリソースでは許可されていません。",
    409: "競合 - リソースの現在の状態との競合により、リクエストを完了できませんでした。",
    422: "処理できないエンティティ - リクエストは適切に形成されていましたが、セマンティックエラーにより従うことができませんでした。",
    429: "リクエストが多すぎます - ユーザーは指定された時間内に多すぎるリクエストを送信しました。",
    
    // Server Errors (500-599)
    500: "サーバー内部エラー - サーバーは処理方法がわからない状況に遭遇しました。",
    501: "実装されていません - サーバーはリクエストを満たすために必要な機能をサポートしていません。",
    502: "不正なゲートウェイ - サーバーは上流サーバーから無効な応答を受信しました。",
    503: "サービス利用不可 - サーバーはリクエストを処理する準備ができていません。",
    504: "ゲートウェイタイムアウト - ゲートウェイとして機能するサーバーは上流サーバーからタイムリーな応答を受信しませんでした。",
    507: "ストレージ不足 - サーバーはリクエストを完了するために必要な表現を保存できません。"
  },
  ar: {
    // Informational (100-199)
    100: "استمر - استلم الخادم رؤوس الطلب ويجب على العميل المتابعة لإرسال جسم الطلب.",
    101: "تبديل البروتوكولات - الخادم يبدل البروتوكولات كما طلب العميل.",
    102: "معالجة - الخادم يعالج الطلب ولكن لا توجد استجابة متاحة بعد.",
    103: "تلميحات مبكرة - تستخدم لإرجاع بعض رؤوس الاستجابة قبل رسالة HTTP النهائية.",
    
    // Success (200-299)
    200: "تم - نجح الطلب.",
    201: "تم الإنشاء - تم إنشاء مورد جديد.",
    202: "مقبول - تم قبول الطلب للمعالجة، لكن المعالجة لم تكتمل بعد.",
    204: "لا يوجد محتوى - عالج الخادم الطلب بنجاح ولا يرجع أي محتوى.",
    206: "محتوى جزئي - الخادم يسلم جزءًا فقط من المورد بسبب رأس النطاق.",
    
    // Redirection (300-399)
    301: "تم النقل بشكل دائم - تم نقل المورد المطلوب بشكل دائم إلى موقع جديد.",
    302: "تم العثور - تم نقل المورد المطلوب مؤقتًا إلى موقع مختلف.",
    304: "لم يتم التعديل - لم يتم تعديل المورد منذ آخر طلب.",
    307: "إعادة توجيه مؤقتة - يجب تكرار الطلب مع URI آخر، لكن يجب على العميل الاستمرار في استخدام URI الأصلي.",
    308: "إعادة توجيه دائمة - يجب تكرار الطلب وجميع الطلبات المستقبلية باستخدام URI آخر.",
    
    // Client Errors (400-499)
    400: "طلب سيء - لا يمكن للخادم أو لن يعالج الطلب بسبب شيء يُعتبر خطأ في العميل.",
    401: "غير مصرح - لم يتم تطبيق الطلب لأنه يفتقر إلى بيانات اعتماد مصادقة صالحة.",
    403: "محظور - فهم الخادم الطلب لكنه يرفض تفويضه.",
    404: "غير موجود - لا يمكن للخادم العثور على المورد المطلوب.",
    405: "الطريقة غير مسموح بها - الطريقة المحددة في الطلب غير مسموح بها للمورد المحدد بواسطة URI الطلب.",
    409: "تضارب - لم يتمكن الطلب من الاكتمال بسبب تضارب مع الحالة الحالية للمورد.",
    422: "كيان غير قابل للمعالجة - كان الطلب منسقًا بشكل جيد لكن لم يمكن اتباعه بسبب أخطاء دلالية.",
    429: "طلبات كثيرة جدًا - أرسل المستخدم طلبات كثيرة جدًا في فترة زمنية معينة.",
    
    // Server Errors (500-599)
    500: "خطأ داخلي في الخادم - واجه الخادم موقفًا لا يعرف كيفية التعامل معه.",
    501: "غير مطبق - لا يدعم الخادم الوظيفة المطلوبة لتنفيذ الطلب.",
    502: "بوابة سيئة - استلم الخادم استجابة غير صالحة من خادم علوي.",
    503: "الخدمة غير متاحة - الخادم غير جاهز لمعالجة الطلب.",
    504: "انتهت مهلة البوابة - الخادم الذي يعمل كبوابة لم يستلم استجابة في الوقت المناسب من خادم علوي.",
    507: "تخزين غير كافٍ - لا يمكن للخادم تخزين التمثيل المطلوب لإكمال الطلب."
  }
};

// Add category translations fallback
const FALLBACK_CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
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
const FALLBACK_USE_CASES_TRANSLATIONS: Record<string, Record<number, string[]>> = {
  en: {
    // Informational (100-199)
    100: ["When uploading large files in chunks", "In WebSockets to confirm a handshake is in progress", "For real-time communication protocols"],
    101: ["When switching protocols (HTTP to WebSocket)", "For protocol upgrade requests", "In real-time applications requiring bidirectional communication"],
    102: ["For long-running processes", "When processing takes significant time", "To prevent client timeout during heavy operations"],
    103: ["For early hints in resource loading", "To preload critical resources", "For performance optimization in web applications"],
    
    // Success (200-299)
    200: ["Standard response for successful HTTP requests", "Response to successful GET requests", "When an API request completes successfully", "For successful data retrieval operations"],
    201: ["After a POST request that creates a new resource", "When an item is successfully added to a database", "For successful user registration", "When a new file is uploaded successfully"],
    202: ["When a request is accepted for processing", "For asynchronous operations", "When a task is queued for background processing", "For batch operations that take time to complete"],
    204: ["After a successful DELETE operation", "When submitting a form that should not navigate away", "For successful operations that don't return content", "When updating a resource without returning the updated data"],
    206: ["For partial content responses", "When streaming video or audio content", "For resume-able downloads", "When serving large files in chunks"],
    
    // Redirection (300-399)
    301: ["When a website has moved permanently to a new domain", "Redirecting from old URLs to new URLs for SEO purposes", "For permanent URL changes", "When consolidating multiple domains"],
    302: ["Temporary redirects during maintenance", "After a successful form submission to redirect to a confirmation page", "For temporary URL changes", "When redirecting to a login page"],
    304: ["When content hasn't changed (caching)", "For conditional requests with valid cache", "To reduce bandwidth usage", "For static resource optimization"],
    307: ["For temporary redirects that preserve the HTTP method", "When maintaining POST data during redirects", "For safe temporary redirects", "When preserving request body in redirects"],
    308: ["For permanent redirects that preserve the HTTP method", "When permanently changing URLs while keeping HTTP method", "For permanent redirects with request body preservation", "When consolidating APIs permanently"],
    
    // Client Errors (400-499)
    400: ["When form validation fails", "When request parameters are missing or invalid", "When the JSON payload is malformed", "For syntax errors in request data"],
    401: ["When a user tries to access a resource without logging in", "When an API key is missing or invalid", "For expired authentication tokens", "When credentials are required but not provided"],
    403: ["When a user is logged in but lacks permission for a resource", "When IP-based restrictions prevent access", "For forbidden file access", "When user role doesn't have required permissions"],
    404: ["When a URL doesn't exist", "When a resource has been deleted", "To mask the existence of sensitive resources for security", "For missing API endpoints"],
    405: ["When using the wrong HTTP method", "For endpoints that don't support certain methods", "When trying to POST to a GET-only endpoint", "For method not allowed errors"],
    409: ["When creating a resource that already exists", "For duplicate email addresses during registration", "When concurrent modifications conflict", "For resource conflict scenarios"],
    422: ["When request is well-formed but semantically incorrect", "For validation errors in request data", "When business logic validation fails", "For unprocessable entity errors"],
    429: ["When rate limits have been exceeded", "To prevent brute force attacks", "For API usage limits", "When too many requests are made in a short time"],
    
    // Server Errors (500-599)
    500: ["When an unhandled exception occurs", "During database connection failure", "When the server encounters an unexpected condition", "For internal server errors"],
    501: ["When the server doesn't support the requested functionality", "For unimplemented HTTP methods", "When a feature is not yet available", "For not implemented server capabilities"],
    502: ["When a proxy or load balancer can't reach the upstream server", "During server deployment or restart", "When backend services are down", "For bad gateway errors"],
    503: ["During scheduled maintenance", "When the server is overloaded", "When a service is temporarily unavailable due to high traffic", "For service unavailable scenarios"],
    504: ["When a gateway timeout occurs", "When upstream servers take too long to respond", "For timeout errors in proxy servers", "When backend services are slow"],
    507: ["When server storage is insufficient", "For disk space issues", "When quota limits are exceeded", "For insufficient storage errors"]
  },
  es: {
    // Informational (100-199)
    100: ["Al cargar archivos grandes en fragmentos", "En WebSockets para confirmar que un protocolo de enlace está en progreso", "Para protocolos de comunicación en tiempo real"],
    101: ["Al cambiar protocolos (HTTP a WebSocket)", "Para solicitudes de actualización de protocolo", "En aplicaciones en tiempo real que requieren comunicación bidireccional"],
    102: ["Para procesos de larga duración", "Cuando el procesamiento toma tiempo significativo", "Para prevenir el tiempo de espera del cliente durante operaciones pesadas"],
    103: ["Para pistas tempranas en la carga de recursos", "Para precargar recursos críticos", "Para optimización de rendimiento en aplicaciones web"],
    
    // Success (200-299)
    200: ["Respuesta estándar para solicitudes HTTP exitosas", "Respuesta a solicitudes GET exitosas", "Cuando una solicitud de API se completa con éxito", "Para operaciones exitosas de recuperación de datos"],
    201: ["Después de una solicitud POST que crea un nuevo recurso", "Cuando un elemento se agrega con éxito a una base de datos", "Para registro exitoso de usuarios", "Cuando un nuevo archivo se sube exitosamente"],
    202: ["Cuando una solicitud es aceptada para procesamiento", "Para operaciones asíncronas", "Cuando una tarea se pone en cola para procesamiento en segundo plano", "Para operaciones por lotes que toman tiempo para completar"],
    204: ["Después de una operación DELETE exitosa", "Al enviar un formulario que no debe navegar", "Para operaciones exitosas que no devuelven contenido", "Al actualizar un recurso sin devolver los datos actualizados"],
    206: ["Para respuestas de contenido parcial", "Al transmitir contenido de video o audio", "Para descargas reanudables", "Al servir archivos grandes en fragmentos"],
    
    // Redirection (300-399)
    301: ["Cuando un sitio web se ha movido permanentemente a un nuevo dominio", "Redirigiendo desde URLs antiguas a nuevas para propósitos SEO", "Para cambios permanentes de URL", "Al consolidar múltiples dominios"],
    302: ["Redirecciones temporales durante mantenimiento", "Después de un envío exitoso de formulario para redirigir a una página de confirmación", "Para cambios temporales de URL", "Al redirigir a una página de inicio de sesión"],
    304: ["Cuando el contenido no ha cambiado (caché)", "Para solicitudes condicionales con caché válido", "Para reducir el uso de ancho de banda", "Para optimización de recursos estáticos"],
    307: ["Para redirecciones temporales que preservan el método HTTP", "Al mantener datos POST durante redirecciones", "Para redirecciones temporales seguras", "Al preservar el cuerpo de la solicitud en redirecciones"],
    308: ["Para redirecciones permanentes que preservan el método HTTP", "Al cambiar permanentemente URLs manteniendo el método HTTP", "Para redirecciones permanentes con preservación del cuerpo de la solicitud", "Al consolidar APIs permanentemente"],
    
    // Client Errors (400-499)
    400: ["Cuando falla la validación del formulario", "Cuando los parámetros de la solicitud están ausentes o son inválidos", "Cuando la carga útil JSON está malformada", "Para errores de sintaxis en los datos de la solicitud"],
    401: ["Cuando un usuario intenta acceder a un recurso sin iniciar sesión", "Cuando falta una clave de API o es inválida", "Para tokens de autenticación expirados", "Cuando se requieren credenciales pero no se proporcionan"],
    403: ["Cuando un usuario ha iniciado sesión pero carece de permisos para un recurso", "Cuando las restricciones basadas en IP previenen el acceso", "Para acceso prohibido a archivos", "Cuando el rol del usuario no tiene los permisos requeridos"],
    404: ["Cuando una URL no existe", "Cuando un recurso ha sido eliminado", "Para enmascarar la existencia de recursos sensibles por seguridad", "Para endpoints de API faltantes"],
    405: ["Cuando se usa el método HTTP incorrecto", "Para endpoints que no soportan ciertos métodos", "Al intentar hacer POST a un endpoint solo GET", "Para errores de método no permitido"],
    409: ["Al crear un recurso que ya existe", "Para direcciones de correo duplicadas durante el registro", "Cuando las modificaciones concurrentes entran en conflicto", "Para escenarios de conflicto de recursos"],
    422: ["Cuando la solicitud está bien formada pero semánticamente incorrecta", "Para errores de validación en los datos de la solicitud", "Cuando falla la validación de lógica de negocio", "Para errores de entidad no procesable"],
    429: ["Cuando se han excedido los límites de tasa", "Para prevenir ataques de fuerza bruta", "Para límites de uso de API", "Cuando se hacen demasiadas solicitudes en poco tiempo"],
    
    // Server Errors (500-599)
    500: ["Cuando ocurre una excepción no controlada", "Durante un fallo de conexión a la base de datos", "Cuando el servidor encuentra una condición inesperada", "Para errores internos del servidor"],
    501: ["Cuando el servidor no soporta la funcionalidad solicitada", "Para métodos HTTP no implementados", "Cuando una característica aún no está disponible", "Para capacidades del servidor no implementadas"],
    502: ["Cuando un proxy o balanceador de carga no puede alcanzar el servidor aguas arriba", "Durante el despliegue o reinicio del servidor", "Cuando los servicios backend están caídos", "Para errores de gateway malo"],
    503: ["Durante mantenimiento programado", "Cuando el servidor está sobrecargado", "Cuando un servicio está temporalmente no disponible debido al alto tráfico", "Para escenarios de servicio no disponible"],
    504: ["Cuando ocurre un timeout de gateway", "Cuando los servidores aguas arriba tardan demasiado en responder", "Para errores de timeout en servidores proxy", "Cuando los servicios backend son lentos"],
    507: ["Cuando el almacenamiento del servidor es insuficiente", "Para problemas de espacio en disco", "Cuando se exceden los límites de cuota", "Para errores de almacenamiento insuficiente"]
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
  getStatusCodeUseCases: (code: number, language: string = 'en'): string[] => {
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
  findStatusCodeByDescription: (description: string): number | null => {
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
      return httpStatusMeaningTyped.findStatusCodeByDescription(description) || null;
    } catch (e) {
      console.error("Error finding status code by description:", e);
      return null;
    }
  }
};

// Add UI text translations
const UI_TEXT_TRANSLATIONS: Record<string, Record<string, string>> = {
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
function getUIText(key: string, language: string): string {
  const lang = language?.toLowerCase() || 'en';
  if (UI_TEXT_TRANSLATIONS[lang] && UI_TEXT_TRANSLATIONS[lang][key]) {
    return UI_TEXT_TRANSLATIONS[lang][key];
  }
  return UI_TEXT_TRANSLATIONS.en[key];
}

export default function Home(): React.JSX.Element {
  const [statusCode, setStatusCode] = useState<string>('404');
  const [description, setDescription] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
  const [activeTab, setActiveTab] = useState<'lookup' | 'description'>('lookup');
  const [result, setResult] = useState<Result>(null);
  const [clientSide, setClientSide] = useState<boolean>(false);
  const [languages, setLanguages] = useState<string[]>(["en"]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Setup client-side data after component mounts
  useEffect(() => {
    setClientSide(true);
    const supportedLangs = safeHttpStatus.getSupportedLanguages();
    console.log("Supported languages:", supportedLangs);
    setLanguages(supportedLangs);
    
    // Set default result for 404
    if (!result) {
      const code = 404;
      const initialResult: StatusResult = {
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
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    console.log("Language changed from", language, "to", newLanguage);
    setLanguage(newLanguage);
    
    // Update result immediately if we have a current result
    if (result && !('error' in result)) {
      const code = result.code;
      console.log("Updating result for language change. Code:", code, "New language:", newLanguage);
      
      // Get updated translations for the new language
      const updatedMeaning = safeHttpStatus.getStatusMeaning(code, newLanguage);
      const updatedCategory = safeHttpStatus.getStatusCategory(code, newLanguage);
      const updatedUseCases = safeHttpStatus.getStatusCodeUseCases(code, newLanguage);
      
      console.log("Updated meaning:", updatedMeaning);
      console.log("Updated category:", updatedCategory);
      console.log("Updated use cases:", updatedUseCases);
      
      const updatedResult: StatusResult = {
        ...result,
        meaning: updatedMeaning,
        category: updatedCategory,
        useCases: updatedUseCases,
      };
      
      console.log("Updated result:", updatedResult);
      setResult(updatedResult);
    }
  };

  const handleStatusCodeLookup = (): void => {
    setIsLoading(true);
    try {
      const code = parseInt(statusCode, 10);
      if (isNaN(code)) {
        setResult({
          error: true,
          message: 'Please enter a valid HTTP status code'
        });
        setIsLoading(false);
        return;
      }

      // Load the use cases directly
      const useCases = safeHttpStatus.getStatusCodeUseCases(code, language);
      console.log("Use cases for code", code, "with language", language, ":", useCases);
      
      // Create the final result object
      const finalResult: StatusResult = {
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
        message: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDescriptionLookup = (): void => {
    setIsLoading(true);
    try {
      if (!description.trim()) {
        setResult({
          error: true,
          message: 'Please enter a description'
        });
        setIsLoading(false);
        return;
      }

      const code = safeHttpStatus.findStatusCodeByDescription(description);
      console.log("Found code for description:", description, ":", code);
      
      if (!code) {
        setResult({
          error: true,
          message: 'No matching status code found for this description'
        });
        setIsLoading(false);
        return;
      }

      // Load the use cases directly
      const useCases = safeHttpStatus.getStatusCodeUseCases(code, language);
      console.log("Use cases for code", code, "with language", language, ":", useCases);
      
      // Create the final result object
      const finalResult: StatusResult = {
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
        message: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusCodeColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      'Informational': 'bg-gradient-to-br from-blue-500 to-blue-600',
      'Success': 'bg-gradient-to-br from-green-500 to-green-600',
      'Redirection': 'bg-gradient-to-br from-teal-500 to-teal-600',
      'Client Error': 'bg-gradient-to-br from-brand-500 to-brand-600',
      'Server Error': 'bg-gradient-to-br from-red-500 to-red-600',
      'Unknown': 'bg-gradient-to-br from-gray-500 to-gray-600'
    };
    return colorMap[category] || 'bg-gradient-to-br from-gray-500 to-gray-600';
  };

  // Language name mapping for display
  const getLanguageName = (code: string): string => {
    const names: Record<string, string> = {
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
    <div className="px-4 max-w-4xl mx-auto min-h-screen flex flex-col">
      <Head>
        <title>HTTP Status Meaning Demo</title>
        <meta name="description" content="Demo for HTTP Status Meaning package" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-1 py-8 pb-16 flex flex-col justify-start items-center gap-8">
        <h1 className="m-0 text-5xl md:text-6xl lg:text-7xl font-extrabold text-center bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight tracking-tight">
          HTTP Status Meaning
        </h1>

        <p className="text-center m-0 text-lg md:text-xl lg:text-2xl text-gray-700 max-w-2xl leading-relaxed font-medium">
          A comprehensive library for HTTP status codes with internationalization support
        </p>

        <div className="flex w-full max-w-md bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-2 gap-2 shadow-lg">
          <button 
            className={`flex-1 px-6 py-4 border-none bg-transparent cursor-pointer text-base font-semibold rounded-xl transition-all duration-300 text-gray-700 relative overflow-hidden ${
              activeTab === 'lookup' 
                ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg transform -translate-y-0.5' 
                : 'hover:bg-white/20 hover:text-gray-900 hover:-translate-y-0.5'
            }`}
            onClick={() => setActiveTab('lookup')}
          >
            Status Code Lookup
          </button>
          <button 
            className={`flex-1 px-6 py-4 border-none bg-transparent cursor-pointer text-base font-semibold rounded-xl transition-all duration-300 text-gray-700 relative overflow-hidden ${
              activeTab === 'description' 
                ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg transform -translate-y-0.5' 
                : 'hover:bg-white/20 hover:text-gray-900 hover:-translate-y-0.5'
            }`}
            onClick={() => setActiveTab('description')}
          >
            Description Lookup
          </button>
        </div>

        <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-3xl before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-brand-500 before:to-brand-600">
          {activeTab === 'lookup' ? (
            <div className="mb-6 w-full">
              <label htmlFor="statusCode" className="block mb-3 font-semibold text-gray-800 text-sm uppercase tracking-wide">
                HTTP Status Code:
              </label>
              <input
                id="statusCode"
                type="text"
                value={statusCode}
                onChange={(e) => setStatusCode(e.target.value)}
                placeholder="Enter HTTP status code (e.g., 404, 200, 500)"
                className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-xl bg-white transition-all duration-300 font-medium text-gray-800 focus:outline-none focus:border-brand-500 focus:shadow-lg focus:-translate-y-0.5"
                onKeyPress={(e) => e.key === 'Enter' && handleStatusCodeLookup()}
                aria-label="HTTP Status Code"
              />
              <div className="mb-6">
                <label htmlFor="language" className="block mb-3 font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Language:
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-xl bg-white transition-all duration-300 font-medium text-gray-800 focus:outline-none focus:border-brand-500 focus:shadow-lg focus:-translate-y-0.5"
                >
                  {clientSide && languages.map(lang => (
                    <option key={lang} value={lang}>{getLanguageName(lang)}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleStatusCodeLookup}
                className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white border-none rounded-xl py-4 px-6 text-lg font-bold cursor-pointer transition-all duration-300 uppercase tracking-wide relative overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-500 hover:before:left-full"
                disabled={isLoading}
              >
                {isLoading ? 'Looking up...' : 'Lookup'}
              </button>
            </div>
          ) : (
            <div className="mb-6 w-full">
              <label htmlFor="description" className="block mb-3 font-semibold text-gray-800 text-sm uppercase tracking-wide">
                Description:
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description or keywords (e.g., Not Found, Server Error)"
                className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-xl bg-white transition-all duration-300 font-medium text-gray-800 focus:outline-none focus:border-brand-500 focus:shadow-lg focus:-translate-y-0.5"
                onKeyPress={(e) => e.key === 'Enter' && handleDescriptionLookup()}
                aria-label="Status Code Description"
              />
              <div className="mb-6">
                <label htmlFor="language" className="block mb-3 font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Language:
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-xl bg-white transition-all duration-300 font-medium text-gray-800 focus:outline-none focus:border-brand-500 focus:shadow-lg focus:-translate-y-0.5"
                >
                  {clientSide && languages.map(lang => (
                    <option key={lang} value={lang}>{getLanguageName(lang)}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleDescriptionLookup}
                className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white border-none rounded-xl py-4 px-6 text-lg font-bold cursor-pointer transition-all duration-300 uppercase tracking-wide relative overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-500 hover:before:left-full"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Find Status Code'}
              </button>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl animate-pulse relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-brand-500 before:to-brand-600">
            <div className="flex justify-center items-center py-8">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading results...</span>
            </div>
          </div>
        )}
        
        {result && !isLoading && (
          <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl animate-slideInUp relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-brand-500 before:to-brand-600">
            {'error' in result ? (
              <div className="text-red-600 font-semibold p-4 rounded-xl bg-red-50 border border-red-200 border-l-4 border-l-red-600 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                {result.message}
              </div>
            ) : (
              <>
                <div className="flex items-center mb-6 gap-6">
                  <div className={`flex justify-center items-center w-20 h-20 rounded-full text-white text-3xl font-extrabold shadow-lg relative overflow-hidden ${getStatusCodeColor(result.category)}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                    {result.code}
                  </div>
                  <h2 className="text-2xl m-0 font-bold text-gray-800 leading-tight flex-1">{result.meaning}</h2>
                </div>
                <div className="mb-6 text-lg font-semibold text-gray-600 p-3 bg-gray-50 rounded-xl border-l-4 border-l-brand-500">
                  {getUIText('category', language)} <span className="text-gray-800">{result.category}</span>
                </div>
                {result.useCases && result.useCases.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl mb-4 font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-xl">💡</span>
                      {getUIText('commonUseCases', language)}
                    </h3>
                    <ul className="p-0 list-none m-0">
                      {result.useCases.map((useCase, index) => (
                        <li key={index} className="mb-4 leading-relaxed text-gray-600 p-4 bg-gray-50 rounded-xl border-l-4 border-l-gray-200 transition-all duration-300 relative hover:bg-gray-100 hover:border-l-brand-500 hover:translate-x-1 before:content-['→'] before:absolute before:left-2 before:text-brand-500 before:font-bold">
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      <footer className="py-8 border-t border-white/10 flex justify-center items-center mt-auto">
        <a
          href="https://github.com/Lukman10a/http-status-meaning"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-600 no-underline py-3 px-6 rounded-full bg-white/15 backdrop-blur-md border border-white/30 transition-all duration-300 font-semibold hover:bg-white/25 hover:text-gray-800 hover:-translate-y-1 hover:shadow-lg"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  );
} 