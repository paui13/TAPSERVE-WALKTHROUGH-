# TapServe Mobile Walkthrough (Web-Based)

This project is a **web-based mobile walkthrough prototype** for the TapServe capstone presentation. It is intentionally designed to look and behave like a mobile app inside the browser, so it can be presented without building an Android/iOS package.

## What is included

- Mobile-sized TapServe UI (390 × 844 presentation frame on desktop; full-screen on smaller displays)
- Splash/loading screen with TapServe house logo
- Login and sign-up walkthrough
- Clickable **Register as Service Provider** flow
- Dynamic/data-driven service category rendering with **See All → All Service Categories → provider list** flow
- Floating **AI Assistant** button with the Tappy mascot
- Booking, provider profile, favorites, messages, tracking, reviews, profile settings, and provider-mode walkthrough screens
- Landing-page Terms and Conditions / Privacy Policy links
- User profile without an Admin Dashboard entry
- No user-facing appeal section in this walkthrough revision

## Run locally

1. Install Node.js 20+.
2. In this folder, run:

```bash
npm install
npm run dev
```

3. Open the local URL printed by Vite.

## Build for presentation hosting

```bash
npm install
npm run build
```

The production output will be created in `dist/` and can be hosted as a normal static website.

## Presentation note

This is a front-end walkthrough prototype. Buttons and screens are wired for demonstration, but there is no production backend/database/payment integration in this package.
