# Moodling

A calm, minimal, quietly luxurious mood + task companion. Built with Expo Router
(SDK 57) so it runs natively via Expo Go — file-based routing, no React
Navigation boilerplate to wire up by hand.

## Setup

```bash
npm install
```

Then open `src/api/client.js` and set `API_BASE_URL` to wherever you deploy
[`moodling_backend`](https://github.com/kvltn8/moodling_backend):

```js
export const API_BASE_URL = "https://your-moodling-backend.example.com";
```

Make sure the Django backend has `django-cors-headers` installed and
configured to allow requests from your dev machine's origin (matters most
when testing via `expo start --web`; native builds aren't subject to CORS).

## Run

```bash
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) to test on a real device, or
press `i` / `a` for a simulator/emulator, or `w` for the web preview.

## Project structure

```
app/
  _layout.js            Root layout: loads fonts, wraps AuthProvider
  index.js              Animated "Moodling" splash, then redirects
  (auth)/
    _layout.js
    login.js             Djoser JWT sign-in
    register.js          Djoser user creation + auto sign-in
  (tabs)/
    _layout.js           Bottom tab bar (Mood / Tasks)
    mood.js              Illustrated mood scale + 7-day history
    tasks.js             To-do list backed by /tasklists/

src/
  theme/index.js         Colors, fonts, spacing, radii
  data/moods.js          The 7-mood scale + unDraw illustration URLs
  api/client.js          Fetch wrapper for the Django backend
  context/AuthContext.js JWT session, persisted via AsyncStorage
  components/            MoodIllustration, PrimaryButton, TopBar
```

## Notes

- Illustrations are hotlinked from unDraw (MIT-licensed, free for commercial
  and personal use, no attribution required) — nothing to download.
- Fonts: Lobster Two (wordmark / splash), Dancing Script (mood blurbs),
  Outfit (everything else, for legibility).
- The JWT is stored in `AsyncStorage`, not `SecureStore` — swap it in
  `src/context/AuthContext.js` if you want it in the device keychain instead.
- Task payloads use a capitalized `Task` field to match the backend
  serializer exactly — this is intentional, not a typo.
