# NexTash Store - Vue.js Conversion

This document explains the conversion of the NexTash Store from HTML templates to a Vue.js single-page application.

## 🎯 What Was Converted

### Original HTML Structure
- **Backend**: Python/Frappe framework with Jinja2 templates
- **Frontend**: HTML templates with vanilla JavaScript
- **Styling**: SCSS compiled to CSS bundle
- **Assets**: Static images, fonts, and libraries

### New Vue.js Structure
- **Framework**: Vue 3 with Composition API
- **Routing**: Vue Router 4 for client-side navigation
- **State Management**: Pinia for authentication and cart state
- **Build Tool**: Vite for fast development and building
- **Styling**: Original CSS bundle + Vue-specific enhancements

## 📁 Project Structure

```
nxt_store/
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── AppNavbar.vue
│   │       ├── AppFooter.vue
│   │       └── AppSidebar.vue
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── ShopView.vue
│   │   ├── ProductView.vue
│   │   ├── CartView.vue
│   │   └── auth/
│   │       ├── LoginView.vue
│   │       └─��� SignupView.vue
│   ├── stores/
│   │   └── auth.js
│   ├── utils/
│   │   ├── api.js
│   │   └── message.js
│   ├── assets/
│   │   └── styles/
│   │       └── main.css
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
└── vite.config.js
```

## 🔄 Converted Components

### Layout Components
- **AppNavbar.vue**: Converted from `templates/components/navbar.html`
- **AppFooter.vue**: Converted from `templates/components/footer.html`
- **AppSidebar.vue**: Converted from `templates/components/sidebar.html`

### Page Components
- **HomeView.vue**: Converted from `www/index.html`
- **ShopView.vue**: Converted from `www/shop.html`
- **ProductView.vue**: Converted from `www/product.html`
- **CartView.vue**: Converted from `www/cart.html`
- **LoginView.vue**: Converted from `www/login.html`
- **SignupView.vue**: Converted from `www/signup.html`

## 🔧 Technical Features

### State Management
- **Authentication Store**: Handles user login/logout state
- **Reactive Data**: Vue's reactivity system replaces jQuery DOM manipulation

### API Integration
- **Utility Functions**: Ported from `public/js/index.js`
- **HTTP Requests**: Uses Fetch API with error handling
- **CSRF Protection**: Maintains security with CSRF tokens

### Routing
- **Client-Side Navigation**: Vue Router replaces server-side routing
- **Protected Routes**: Authentication guards for private pages
- **Dynamic Routes**: Product and category pages with parameters

### Styling
- **Original Design**: Preserved all original CSS styling
- **Responsive Design**: Maintained mobile-first approach
- **Component Scoped**: Added Vue-specific styling enhancements

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19.0 or later
- npm or yarn package manager

### Installation
```bash
# Navigate to Vue app directory
cd nxt_store

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development
```bash
# Start dev server (usually runs on http://localhost:5173)
npm run dev

# The Vue app will proxy API calls to the backend server
# Make sure your Frappe backend is running on port 8000
```

## 🔗 API Integration

### Backend Compatibility
The Vue app maintains compatibility with the existing Frappe backend:

- **API Endpoints**: Uses the same API methods
- **Authentication**: Integrates with Frappe session management
- **Data Format**: Expects the same JSON response structure

### Proxy Configuration
Vite development server proxies these paths to the backend:
- `/api/*` - API endpoints
- `/assets/*` - Static assets (images, CSS, JS)

## 📱 Features Implemented

### ✅ Completed Features
- [x] Homepage with sliders and product sections
- [x] Shop page with filtering and pagination
- [x] Product detail page with gallery and variations
- [x] User authentication (login/signup)
- [x] Shopping cart functionality
- [x] Responsive navigation
- [x] Error handling and loading states

### 🔄 Integration Points
- **Backend APIs**: All API calls point to existing Frappe endpoints
- **Asset Serving**: Static assets served from original `/assets/` path
- **Session Management**: Integrates with Frappe user sessions
- **CSRF Protection**: Uses Frappe CSRF tokens

## 🎨 Styling Approach

### CSS Integration
1. **Original Bundle**: Imports the compiled `nextash_store.bundle.css`
2. **Vue Enhancements**: Adds Vue-specific styles in `main.css`
3. **Component Styles**: Scoped styles in individual components
4. **Responsive**: Maintains all original responsive breakpoints

### Design Preservation
- All original styling and branding preserved
- Color schemes and typography unchanged
- Component layouts match original designs
- Mobile responsiveness maintained

## 🔧 Configuration

### Environment Setup
The app is configured to work with the existing Frappe backend. Update the proxy settings in `vite.config.js` if your backend runs on a different port:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000', // Update this URL
      changeOrigin: true,
      secure: false
    }
  }
}
```

### Build Configuration
For production deployment, the built files should be served alongside the Frappe backend, or the API calls should be updated to point to the production backend URL.

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
# Files will be in the `dist/` directory
```

### Integration with Frappe
The built Vue app can be integrated with the Frappe backend by:
1. Serving the built files from Frappe
2. Updating API URLs for production
3. Configuring proper CORS headers if serving from different domains

## 📋 Migration Notes

### What's Different
- **Client-side routing**: Pages don't reload on navigation
- **State management**: User state persists across page changes
- **API calls**: Asynchronous data loading with loading states
- **Form handling**: Vue reactive forms instead of traditional forms

### What's Preserved
- **All functionality**: Every feature from the original site
- **Visual design**: Identical appearance and layout
- **Backend integration**: Same API endpoints and data structure
- **SEO considerations**: Meta tags and structure preserved

This conversion provides a modern, fast, and maintainable frontend while preserving all the functionality and design of the original HTML-based website.
