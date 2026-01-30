# Health Coach AI - Vercel Deployment Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git repository initialized
- Vercel account (vercel.com)

## Local Build & Test

```bash
cd "Health Coach AI Website"
npm install
npm run build
npm run client:preview
```

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "chore: prepare for vercel deployment"
git push origin main
```

### 2. Connect to Vercel
- Go to vercel.com
- Click "New Project"
- Import your GitHub repository
- Vercel auto-detects Vite project

### 3. Configure Environment Variables (if needed)
In Vercel Dashboard > Project Settings > Environment Variables:
```
VITE_APP_TITLE=Health Coach AI
```

### 4. Deploy
Vercel automatically builds and deploys on every push to main branch.

## Deployment Configuration

**vercel.json** is configured with:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite
- SPA routing: All non-file requests redirect to index.html

**vite.config.ts** includes:
- Code splitting for vendor and chart libraries
- Terser minification for production
- Source maps disabled for smaller bundle size

## Build Output
- **Build directory:** `/dist`
- **Entry point:** `/dist/index.html`
- **Build size:** ~1.2-1.5 MB (depends on dependencies)

## Features Included
✅ User authentication (mock backend with 2s delay)
✅ Health monitoring dashboards with charts
✅ Prescription document upload with AI summary
✅ Activity tracking with 60-day mock data
✅ Sleep, heart rate, blood oxygen monitoring
✅ Responsive design with dark mode
✅ Toast notifications
✅ Medication reminders
✅ Diet recommendations

## Post-Deployment
- App will be live at: `https://<your-project-name>.vercel.app`
- Automatic deployments on every push
- Environment-specific builds available (preview, production)
