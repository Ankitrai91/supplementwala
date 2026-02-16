# NutriStar Frontend
http://localhost:5000/api  backend

http://localhost:5173 frontend

Modern React + Vite ecommerce frontend for NutriStar nutritional supplements store.

## Prerequisites


- Node.js 16+ 
- npm or yarn package manager

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
cp .env.example .env.local
```

Update the environment variables:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FRONTEND_URL=http://localhost:5173
```

### 3. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Structure

```
frontend/
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Main app component
│   ├── App.css               # Global styles
│   ├── index.css             # Base styles
│   ├── api/                  # API client configuration
│   │   └── axiosClient.js
│   ├── components/           # Reusable components
│   │   ├── Header.jsx
│   │   ├── ProductCard.jsx
│   │   └── MegaMenu.jsx
│   ├── pages/                # Page components
│   │   ├── HomePage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProfileEditPage.jsx
│   │   └── WalletPage.jsx
│   ├── services/             # API services
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── cartService.js
│   ├── store/                # Redux store
│   │   ├── store.js
│   │   └── slices/           # Redux slices
│   │       ├── authSlice.js
│   │       ├── cartSlice.js
│   │       ├── productSlice.js
│   │       └── userSlice.js
│   └── styles/               # Component styles
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
└── .env.local                # Environment variables
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router v6** - Client-side routing
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **CSS3** - Styling

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`. Ensure the backend server is running before starting the frontend.

### Key API Endpoints

- `/auth` - Authentication (login, register)
- `/products` - Products and variants
- `/categories` - Product categories
- `/brands` - Product brands
- `/cart` - Shopping cart
- `/orders` - Order management
- `/user` - User profile and wallet

## Features

- User authentication and authorization
- Product browsing with filtering and search
- Shopping cart with variant selection
- Order placement and tracking
- Supercash rewards system
- User dashboard and profile management
- Responsive design

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, modify `vite.config.js`:

```js
server: {
  port: 3000,  // Change to your preferred port
}
```

### API Connection Issues

Ensure the backend is running and check:
1. Backend URL in `.env.local` is correct
2. CORS is properly configured on the backend
3. Backend is listening on port 5000

## Performance Optimization

- Code splitting with React Router
- Lazy loading of components
- Redux for efficient state management
- Vite's optimized build process

## Development Guidelines

- Use Redux for global state (auth, cart, products)
- Use React hooks for local component state
- Follow the existing component structure
- Keep API calls in services/hooks
- Use CSS modules or scoped CSS for styling
