# Planning Poker Clone

An Open source, modern, real-time Planning Poker application built with React, Tailwind CSS, Firebase, and Firestore.

## Features

-  Real-time voting with Fibonacci sequence
-  Live participant synchronization
-  Visual voting results with charts
-  Interactive emoji throwing feature
-  Issue management with CSV import/export
-  Fully responsive design

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 20.10.0 or higher
- npm 10.2.3 or higher
- Firebase project with Firestore enabled

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your Firebase credentials:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your Firebase configuration from [Firebase Console](https://console.firebase.google.com/)

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

### Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in the project (select Hosting):
   ```bash
   firebase init
   ```

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## Configuration

### Rate Limiting

To control Firebase costs, adjust rate limits in `src/config/rateLimits.ts`:

- `EMOJI_THROW_COOLDOWN`: Time between emoji throws (default: 1000ms)
- `MAX_EMOJIS_PER_MINUTE`: Maximum emojis per participant per minute (default: 10)
- `VOTE_UPDATE_DEBOUNCE`: Debounce time for vote updates (default: 500ms)
- `LISTENER_THROTTLE`: Throttle time for Firestore updates (default: 100ms)
- `MAX_PARTICIPANTS`: Maximum participants per game (default: 20)
- `MAX_ISSUES`: Maximum issues per game (default: 50)

## Usage

1. **Create a Game**: Click "Start New Game" and enter your name
2. **Invite Team**: Share the game link with your team members
3. **Add Issues**: Use the sidebar to add stories/issues to estimate
4. **Vote**: Each participant selects their estimate using voting cards
5. **Reveal**: Host reveals all votes to see results
6. **Finalize**: Agree on the final estimate and move to the next issue

### Issue Management

- Add issues manually via the sidebar
- Export estimated issues to CSV

### Voting System

- Fibonacci sequence: 0, 1, 2, 3, 5, 8, 13, 21
- Special cards: ? (unknown) and ☕ (break)
- Real-time vote synchronization
- Visual results with statistics (average, median, mode)
- Consensus indicator

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
