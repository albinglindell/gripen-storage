# Firebase Login App with Ant Design

A modern React application with Firebase authentication using Ant Design components.

## Features

- 🔐 Firebase Authentication (Email/Password)
- 🎨 Modern UI with Ant Design
- 📱 Responsive design
- 🛡️ Protected routes
- 🎯 TypeScript support
- ⚡ React Router for navigation
- 🔒 Environment variables for security

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure Environment Variables:**

   - Copy `env.example` to `.env`
   - Update the `.env` file with your Firebase configuration:

   ```bash
   cp env.example .env
   ```

   Then edit `.env` with your actual Firebase values:

   ```env
   REACT_APP_FIREBASE_API_KEY=your-actual-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

3. **Configure Firebase:**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password provider
   - Get your Firebase config from Project Settings

4. **Start the development server:**

   ```bash
   npm start
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/
│   ├── LoginPage.tsx      # Login/Signup form
│   ├── Dashboard.tsx      # Landing page after login
│   └── PrivateRoute.tsx   # Route protection
├── contexts/
│   └── AuthContext.tsx    # Authentication context
├── firebase/
│   └── config.ts         # Firebase configuration
├── types/
│   └── auth.ts           # TypeScript interfaces
├── App.tsx               # Main app component
└── index.tsx             # Entry point
```

## Usage

1. **Login Page (`/`):**

   - Toggle between login and signup modes
   - Form validation with Ant Design
   - Error handling for authentication failures

2. **Dashboard (`/dashboard`):**
   - Protected route (requires authentication)
   - Modern admin panel layout
   - User information display
   - Logout functionality

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Ant Design** - UI component library
- **Firebase** - Authentication and backend
- **React Router** - Navigation
- **React Context** - State management

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Customization

The app uses Ant Design's theme system. You can customize colors, spacing, and other design tokens in `src/App.tsx`:

```typescript
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 8,
    },
  }}
>
```

## Security Notes

- Firebase handles authentication securely
- Protected routes prevent unauthorized access
- Form validation on both client and server side
- Environment variables are used for Firebase config
- `.env` file is gitignored to prevent committing sensitive data
- Always use environment variables in production deployments

## Environment Variables

The application uses the following environment variables (all prefixed with `REACT_APP_`):

- `REACT_APP_FIREBASE_API_KEY` - Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `REACT_APP_FIREBASE_PROJECT_ID` - Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID` - Firebase app ID
- `REACT_APP_FIREBASE_MEASUREMENT_ID` - Firebase measurement ID (optional)

**Important:** Never commit your `.env` file to version control. The `.gitignore` file is configured to exclude it automatically.
