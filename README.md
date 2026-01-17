# 🌾 Aswenna Portal

A modern, full-featured authentication system built with React, TypeScript, and Vite.

![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.5-purple)
![React Router](https://img.shields.io/badge/React%20Router-Latest-red)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✨ Features

- ✅ **Complete Authentication System**
  - Login with email/password
  - User registration (Sign-up)
  - Password recovery (Forgot password)
  - Logout functionality

- ✅ **Protected Routes**
  - Route guards for authenticated pages
  - Automatic redirects based on auth state
  - Public routes (login, signup)
  - Private routes (dashboard, profile, etc.)

- ✅ **Modern UI/UX**
  - Responsive design (mobile, tablet, desktop)
  - Dark theme
  - Password visibility toggle
  - Form validation
  - Error handling

- ✅ **State Management**
  - React Context API for global auth state
  - LocalStorage persistence
  - Custom useAuth hook

- ✅ **Type Safety**
  - Full TypeScript support
  - Strict type checking
  - Type definitions for all components

- ✅ **Developer Experience**
  - Hot Module Replacement (HMR)
  - Fast Refresh
  - Path aliases (@/*)
  - ESLint configuration
  - Comprehensive documentation

---

## 📂 Project Structure

```
src/
├── pages/              # Page components
│   ├── App.tsx        # Root component with routing
│   ├── Login.tsx      # Login page
│   ├── SignUp.tsx     # Registration page
│   ├── Dashboard.tsx  # Protected dashboard
│   └── ...
├── components/        # Reusable components
│   ├── ProtectedRoute.tsx
│   └── PublicRoute.tsx
├── Context/          # React Context
│   ├── AuthContext.tsx
│   └── useAuth.ts
├── styles/           # CSS stylesheets
├── constants/        # App constants
├── types/           # TypeScript types
└── utils/           # Utility functions
```

---

## 🗺️ Routes

| Path | Component | Access | Description |
|------|-----------|--------|-------------|
| `/` | Redirect | Public | Redirects to login |
| `/login` | Login | Public | User login |
| `/signup` | SignUp | Public | Registration |
| `/forgot-password` | ForgotPassword | Public | Password reset |
| `/dashboard` | Dashboard | Protected | Main app (requires auth) |

---

## 🔐 Authentication

### Current Implementation
The authentication system currently uses **mock authentication** for demonstration. 

```typescript
// Login with any credentials
login("user@example.com", "password123");

// Sign up
signup("user@example.com", "password123", "John Doe");

// Logout
logout();
```

### Integration with Backend
To connect to your backend API, update `src/Context/AuthContext.tsx`:

```typescript
const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    setUser(data.user);
    localStorage.setItem('token', data.token);
  } else {
    throw new Error(data.message);
  }
};
```

---

## 📚 Documentation

- **[AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)** - Complete authentication setup guide
- **[ROUTING_GUIDE.md](./ROUTING_GUIDE.md)** - React Router documentation
- **[FOLDER_EXPLANATIONS.md](./FOLDER_EXPLANATIONS.md)** - Detailed folder structure
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Project overview and status
- **[VISUAL_STRUCTURE.md](./VISUAL_STRUCTURE.md)** - Visual diagrams and flows

---

## 🛠️ Technology Stack

- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7** - Build tool & dev server
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **CSS** - Styling (no framework dependencies)

---

## 🎨 Customization

### Theme Colors
Edit `src/styles/global.css`:

```css
:root {
  --primary-color: #6b8e6f;      /* Agricultural Green */
  --background: #1a1a1a;         /* Dark Background */
  --text-primary: #ffffff;       /* White */
  --text-secondary: #b0b0b0;     /* Light Gray */
}
```

### Environment Variables
Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Aswenna Portal
```

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🚧 What to Add Next

### 1. Backend API Integration
```typescript
// src/services/authService.ts
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (data) => api.post('/auth/signup', data),
  logout: () => api.post('/auth/logout'),
};
```

### 2. Form Validation
```bash
npm install react-hook-form zod @hookform/resolvers
```

### 3. API Client
```bash
npm install axios
```

### 4. Notifications
```bash
npm install react-hot-toast
```

### 5. UI Components
```bash
npm install @shadcn/ui
# or
npm install @mui/material
```

---

## 📱 Assets Required

Place these files in the `public/` folder:

- **`logo.png`** - Your application logo (200x200px)
- **`farmer-illustration.jpg`** - Background image for auth pages (1200x1200px)

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in vite.config.ts
server: {
  port: 3000
}
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Import Errors
Check path aliases in `tsconfig.app.json`:
```json
"paths": {
  "@/*": ["./src/*"],
  "@/Context/*": ["./src/Context/*"]
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- React Team for React 19
- Vite Team for the amazing build tool
- React Router for routing solution
- Lucide for the beautiful icons

---

## 📞 Support

For questions or issues:
1. Check the [documentation files](#-documentation)
2. Review code comments
3. Open an issue on GitHub

---

**Built with ❤️ using React, TypeScript, and Vite**

---

## 🎯 Project Status

- ✅ Authentication pages complete
- ✅ Routing configured
- ✅ Context state management working
- ✅ TypeScript types defined
- ✅ Responsive design implemented
- ✅ Documentation complete
- 📋 Backend integration pending
- 📋 Additional features to be added

**Ready for development!** 🚀
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
