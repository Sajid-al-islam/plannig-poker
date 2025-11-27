# Quick Start Guide

## Prerequisites

Before running the application, you need:
1. **Firebase Project**: Create a project at [Firebase Console](https://console.firebase.google.com/)
2. **Firestore Database**: Enable Firestore in your Firebase project
3. **Node.js**: Version 20.10.0 or higher

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Firebase credentials:
   - Go to your Firebase project settings
   - Find your web app configuration
   - Copy the values and paste into `.env`

Example `.env`:
```
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Test the Application

1. **Create a Game**:
   - Click "Start New Game"
   - Enter your name
   - You'll get a unique game URL

2. **Invite Team Members**:
   - Share the game URL with your team
   - Each person joins with their name

3. **Start Estimating**:
   - Add issues via the sidebar
   - Select an issue to begin voting
   - Everyone picks their estimate
   - Host reveals the votes
   - View the results and consensus

## Rate Limiting Configuration

To control Firebase costs, edit `src/config/rateLimits.ts`:

```typescript
export const RATE_LIMITS = {
  EMOJI_THROW_COOLDOWN: 1000,        // ms between emoji throws
  MAX_EMOJIS_PER_MINUTE: 10,         // max emojis per participant per minute
  VOTE_UPDATE_DEBOUNCE: 500,         // debounce vote updates
  LISTENER_THROTTLE: 100,            // throttle Firestore listeners
  MAX_PARTICIPANTS: 20,               // max participants per game
  MAX_ISSUES: 50,                     // max issues per game
};
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login:
   ```bash
   firebase login
   ```

3. Initialize (select Hosting):
   ```bash
   firebase init
   ```

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## Troubleshooting

### "Firebase not configured" error
- Make sure you've created `.env` file with your Firebase credentials
- Restart the dev server after creating/updating `.env`

### Node version error
- Ensure you're using Node.js >= 20.10.0
- Check with: `node --version`

### Port already in use
- Vite will automatically try the next available port
- Or specify a port: `vite --port 3000`

## Need Help?

- Check the [README.md](./README.md) for more details
- Review the [Implementation Plan](./implementation_plan.md)
- Open an issue on GitHub
