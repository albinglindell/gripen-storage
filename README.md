# Gripen Storage - Firebase & Cloudinary App

A modern React application with Firebase authentication and Cloudinary image storage using Ant Design components.

## Features

- 🔐 Firebase Authentication (Email/Password)
- ☁️ Cloudinary Image Storage (Cost-effective alternative to Firebase Storage)
- 🎨 Modern UI with Ant Design
- 📱 Responsive design
- 🛡️ Protected routes
- 🎯 TypeScript support
- ⚡ React Router for navigation
- 🔒 Environment variables for security
- 🖼️ Image optimization and CDN delivery

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project
- Cloudinary account

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure Environment Variables:**

   - Copy `env.example` to `.env`
   - Update the `.env` file with your Firebase and Cloudinary configuration:

   ```bash
   cp env.example .env
   ```

   Then edit `.env` with your actual values:

   ```env
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your-actual-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

   # Cloudinary Configuration (for image uploads)
   REACT_APP_CLOUDINARY_CLOUD_NAME=your-cloud-name
   REACT_APP_CLOUDINARY_API_KEY=your-api-key
   REACT_APP_CLOUDINARY_API_SECRET=your-api-secret
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=gripen_storage
   ```

3. **Configure Firebase:**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password provider
   - Get your Firebase config from Project Settings

4. **Configure Cloudinary:**

   - Create a Cloudinary account at [Cloudinary Console](https://cloudinary.com/console)
   - Set up an upload preset (see `CLOUDINARY_SETUP.md` for detailed instructions)
   - Get your Cloudinary credentials from the dashboard

5. **Start the development server:**

   ```bash
   npm start
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/
│   ├── LoginPage.tsx      # Login/Signup form
│   ├── Dashboard.tsx      # Landing page after login
│   ├── RoomDetail.tsx     # Room management with image uploads
│   ├── EditBox.tsx        # Box editing with image uploads
│   └── PrivateRoute.tsx   # Route protection
├── contexts/
│   └── AuthContext.tsx    # Authentication context
├── firebase/
│   └── config.ts         # Firebase configuration
├── services/
│   ├── firebaseService.ts # Firebase database operations
│   └── cloudinaryService.ts # Cloudinary image operations
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

3. **Image Uploads:**
   - Upload images for storage boxes
   - Automatic optimization and compression
   - CDN delivery for fast loading
   - User-specific folder organization

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Ant Design** - UI component library
- **Firebase** - Authentication and database
- **Cloudinary** - Image storage and optimization (browser-compatible)
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
- Cloudinary uses unsigned uploads with preset restrictions
- Protected routes prevent unauthorized access
- Form validation on both client and server side
- Environment variables are used for all API configurations
- `.env` file is gitignored to prevent committing sensitive data
- Always use environment variables in production deployments

## Environment Variables

The application uses the following environment variables (all prefixed with `REACT_APP_`):

### Firebase Configuration

- `REACT_APP_FIREBASE_API_KEY` - Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `REACT_APP_FIREBASE_PROJECT_ID` - Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID` - Firebase app ID
- `REACT_APP_FIREBASE_MEASUREMENT_ID` - Firebase measurement ID (optional)

### Cloudinary Configuration

- `REACT_APP_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `REACT_APP_CLOUDINARY_API_KEY` - Cloudinary API key
- `REACT_APP_CLOUDINARY_API_SECRET` - Cloudinary API secret
- `REACT_APP_CLOUDINARY_UPLOAD_PRESET` - Cloudinary upload preset name

**Important:** Never commit your `.env` file to version control. The `.gitignore` file is configured to exclude it automatically.

## Additional Documentation

- [Firebase Setup Guide](FIREBASE_SETUP.md) - Detailed Firebase configuration
- [Cloudinary Setup Guide](CLOUDINARY_SETUP.md) - Detailed Cloudinary configuration and migration guide
