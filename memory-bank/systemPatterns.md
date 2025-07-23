# System Patterns: HTTP Status Meaning Demo

## Architecture Overview

### Technology Stack
- **Frontend Framework**: Next.js 14.0.3 with React 18.2.0
- **Styling**: CSS Modules with global styles
- **Core Package**: `http-status-meaning` npm package (v1.0.1)
- **Deployment**: Vercel-ready with static generation

### Application Structure
```
http-status-meaning-demo/
├── pages/                    # Next.js pages directory
│   ├── _app.js              # App wrapper component
│   ├── index.js             # Main application page (739 lines)
│   └── api/                 # API routes
│       ├── status-code.js   # Status code lookup endpoint
│       └── description.js   # Description lookup endpoint
├── styles/                  # Styling
│   ├── globals.css          # Global CSS styles
│   └── Home.module.css      # Component-specific CSS modules
└── package.json             # Dependencies and scripts
```

## Key Design Patterns

### 1. Safe Wrapper Pattern
The application implements a comprehensive safe wrapper around the `http-status-meaning` package to handle potential failures gracefully.

**Implementation**: `safeHttpStatus` object in `pages/index.js`
```javascript
const safeHttpStatus = {
  getSupportedLanguages: () => { /* fallback logic */ },
  getStatusMeaning: (code, language) => { /* fallback logic */ },
  getStatusCategory: (code, language) => { /* fallback logic */ },
  getStatusCodeUseCases: (code, language) => { /* fallback logic */ },
  findStatusCodeByDescription: (description) => { /* fallback logic */ }
};
```

**Benefits**:
- Application continues working even if the package fails
- Graceful degradation to fallback data
- Consistent error handling across all functions

### 2. Fallback Data System
Extensive fallback data is embedded in the application to ensure reliability.

**Components**:
- `FALLBACK_TRANSLATIONS`: Status code meanings in multiple languages
- `FALLBACK_CATEGORY_TRANSLATIONS`: Category names in different languages
- `FALLBACK_USE_CASES`: Common use cases for popular status codes
- `FALLBACK_USE_CASES_TRANSLATIONS`: Translated use cases

### 3. Tabbed Interface Pattern
The application uses a tabbed interface to separate different search modes.

**Implementation**:
- `activeTab` state controls which tab is active
- Conditional rendering based on `activeTab` value
- Shared language selector across both tabs

### 4. Client-Side Hydration Pattern
The application handles server-side rendering and client-side hydration properly.

**Implementation**:
- `clientSide` state tracks when component has mounted
- Language dropdown only renders after client-side hydration
- Prevents hydration mismatches between server and client

## Component Relationships

### Main Page Component (`pages/index.js`)
- **Size**: 739 lines (large component)
- **Responsibilities**:
  - State management for all UI interactions
  - API integration with safe wrapper
  - Language switching logic
  - Tab management
  - Result display formatting

### API Routes
Both API routes follow the same pattern:
1. Extract query parameters
2. Validate inputs
3. Call safe wrapper functions
4. Return JSON response with error handling

**`/api/status-code.js`**:
- Accepts `code` and `language` parameters
- Returns status code information

**`/api/description.js`**:
- Accepts `description` and `language` parameters
- Returns matching status code information

## State Management Patterns

### Local State Management
The application uses React's `useState` for all state management:

```javascript
const [statusCode, setStatusCode] = useState('404');
const [description, setDescription] = useState('');
const [language, setLanguage] = useState('en');
const [activeTab, setActiveTab] = useState('lookup');
const [result, setResult] = useState(null);
const [clientSide, setClientSide] = useState(false);
const [languages, setLanguages] = useState(["en"]);
```

### State Update Patterns
1. **Immediate Updates**: Language changes trigger immediate result updates
2. **Validation**: Input validation before API calls
3. **Error Handling**: Error states stored in result object

## Error Handling Patterns

### Graceful Degradation
- Package failures don't break the application
- Fallback data ensures functionality
- User-friendly error messages

### Input Validation
- Status code validation (numeric, valid range)
- Description validation (non-empty)
- Language validation (supported languages)

### API Error Handling
- Try-catch blocks around all package calls
- Fallback to English when language not available
- Console logging for debugging

## Styling Patterns

### CSS Modules
- Component-specific styles in `Home.module.css`
- Global styles in `globals.css`
- Responsive design with media queries

### Color System
- **Primary**: Orange (#ff9800) for buttons and active states
- **Background**: Light cream (#F8F4EC) for cards
- **Text**: Black for readability
- **Status Colors**: Semantic colors for different status categories

### Responsive Design
- Mobile-first approach
- Breakpoint at 600px for mobile adjustments
- Flexible layouts with max-width constraints

## Performance Patterns

### Code Splitting
- Next.js automatic code splitting
- API routes loaded on demand

### Caching Strategy
- Static generation for the main page
- API responses can be cached by clients

### Bundle Optimization
- Minimal dependencies
- Efficient fallback data structure

## Security Patterns

### Input Sanitization
- Parameter validation in API routes
- Type checking for status codes
- Safe string handling

### API Security
- No sensitive data exposure
- Rate limiting handled by hosting platform
- CORS configuration for API access

## Deployment Patterns

### Vercel Optimization
- Next.js optimized for Vercel deployment
- Static generation for better performance
- API routes for dynamic functionality

### Environment Configuration
- No environment variables required
- Self-contained application
- Package dependencies managed via npm 