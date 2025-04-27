# HTTP Status Meaning Demo

A comprehensive, multilingual web application for looking up HTTP status codes, their meanings, categories, and common use cases.

![HTTP Status Meaning Demo](https://github.com/Lukman10a/http-status-meaning/raw/main/demo-screenshot.png)

## Features

- **HTTP Status Code Lookup**: Enter a status code to get its meaning, category, and common use cases
- **Description-based Search**: Find a status code by searching for keywords or descriptions
- **Multilingual Support**: Interface and content available in 10 languages:
  - English, Spanish, French, German, Portuguese, Italian, Russian, Chinese, Japanese, and Arabic
- **Color-coded Categories**: Visual differentiation between Informational, Success, Redirection, Client Error, and Server Error codes
- **Responsive Design**: Works on desktop and mobile devices
- **API Integration**: Built on the [http-status-meaning](https://github.com/Lukman10a/http-status-meaning) npm package

## Live Demo

Visit the live demo at: [https://http-status-meaning-demo.vercel.app](https://http-status-meaning-demo.vercel.app)

## Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- npm or Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Lukman10a/http-status-meaning-demo.git
   cd http-status-meaning-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Status Code Lookup

1. Select the "Status Code Lookup" tab
2. Enter an HTTP status code (e.g., 404, 200, 500)
3. Select your preferred language from the dropdown
4. Click "Lookup" to view detailed information

### Description Lookup

1. Select the "Description Lookup" tab
2. Enter a keyword or phrase (e.g., "not found", "server error")
3. Select your preferred language from the dropdown
4. Click "Find Status Code" to get the matching status code with details

## Project Structure

```
http-status-meaning-demo/
├── pages/                    # Next.js pages
│   ├── _app.js              # App component to initialize pages
│   ├── index.js             # Main application page
│   └── api/                 # API routes
│       ├── status-code.js   # Status code lookup endpoint
│       └── description.js   # Description lookup endpoint
├── styles/                  # CSS styles
│   ├── globals.css          # Global styles
│   └── Home.module.css      # Component-specific styles
├── public/                  # Static assets
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

## API Endpoints

This project includes two API endpoints that you can use in your own applications:

### `/api/status-code`

Returns information about a specific HTTP status code.

**Parameters:**
- `code` (required): The HTTP status code to look up
- `language` (optional): Language code for the response (defaults to 'en')

**Example Request:**
```
GET /api/status-code?code=404&language=fr
```

**Example Response:**
```json
{
  "code": 404,
  "meaning": "Non trouvé - Le serveur ne peut pas trouver la ressource demandée.",
  "category": "Erreur Client",
  "useCases": [
    "Lorsqu'une URL n'existe pas",
    "Lorsqu'une ressource a été supprimée",
    "Pour masquer l'existence de ressources sensibles pour la sécurité"
  ]
}
```

### `/api/description`

Finds a status code based on a description.

**Parameters:**
- `description` (required): The description to match
- `language` (optional): Language code for the response (defaults to 'en')

**Example Request:**
```
GET /api/description?description=not%20found&language=es
```

**Example Response:**
```json
{
  "code": 404,
  "meaning": "No encontrado - El servidor no puede encontrar el recurso solicitado.",
  "category": "Error del Cliente",
  "useCases": [
    "Cuando una URL no existe",
    "Cuando un recurso ha sido eliminado",
    "Para enmascarar la existencia de recursos sensibles por seguridad"
  ]
}
```

## Error Handling

The application includes robust error handling for various scenarios:

- Invalid status codes
- Unrecognized descriptions
- Network issues
- Fallback translations when specific languages aren't available

## Deployment

The application can be easily deployed to Vercel, Netlify, or other hosting services that support Next.js.

To deploy to Vercel:

```bash
npm install -g vercel
vercel
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Built with [Next.js](https://nextjs.org/)
- Powered by the [http-status-meaning](https://github.com/Lukman10a/http-status-meaning) npm package
- Icons by [FontAwesome](https://fontawesome.com/)
- Design inspiration from [MDN Web Docs](https://developer.mozilla.org/)

## Contact

Lukman Abdulrauf - [@Lukman10a](https://github.com/Lukman10a)

Project Link: [https://github.com/Lukman10a/http-status-meaning-demo](https://github.com/Lukman10a/http-status-meaning-demo) 