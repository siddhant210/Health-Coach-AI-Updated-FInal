# Health Coach AI - Frontend Application

A modern React + TypeScript health monitoring and coaching application built with Vite, featuring real-time health metrics, prescription management, and AI-powered recommendations.

## Features

- 🏥 **Health Monitoring**: Track heart rate, blood oxygen, body temperature, sleep patterns
- 💊 **Prescription Management**: Upload documents with AI-powered summary extraction
- 🎯 **Activity Tracking**: Monitor daily activity, exercise time, stand hours
- 📊 **Health Dashboards**: Visual charts and analytics for health metrics
- 💬 **AI Chatbot**: Floating chatbot for health guidance
- 🌙 **Dark Mode**: Full dark mode support
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Charts**: Chart.js, Recharts
- **Routing**: React Router v6
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd "Health Coach AI Website"
npm install
```

### Development

```bash
npm run client:dev
```

Server starts at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run client:preview
```

## Project Structure

```
src/
├── pages/
│   ├── auth/           # Login, SignUp pages
│   ├── dashboard/      # Main dashboard
│   ├── health-data/    # Health metrics (heart rate, sleep, etc)
│   ├── Other/          # Medication, Diet, Documents
│   └── profile/        # User profile
├── components/         # Reusable components
├── context/           # Theme context
├── hooks/             # Custom hooks
├── App.tsx            # Main app router
└── main.tsx           # Entry point
```

## Key Pages

| Route | Description |
|-------|------------|
| `/login` | User authentication (no password validation) |
| `/signup` | New user registration |
| `/dashboard` | Main health dashboard |
| `/heart-rate-monitor` | Heart rate monitoring with charts |
| `/sleep` | Sleep analysis and tracking |
| `/blood-oxygen` | SpO2 level monitoring |
| `/body-temperature` | Wrist temperature tracking |
| `/activity` | Weekly activity summary |
| `/documents` | Upload & manage health documents |
| `/medications` | Medication tracking |
| `/diet` | Diet recommendations |
| `/profile` | User profile settings |

## Mock Data

All data is client-side generated mock data:
- 60-day activity history
- 30-90 day health metrics
- Realistic prescription summaries
- Dynamic charts and visualizations

## Environment Variables

Optional environment variables in `.env`:

```
VITE_APP_TITLE=Health Coach AI
```

## Login Credentials

**Test any email/password** - no validation required:
- Example: `sidworks21@gmail.com` / `123456`
- Or use any other credentials

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Vercel auto-detects Vite and deploys automatically
4. Live URL: `https://<project-name>.vercel.app`

See `DEPLOYMENT.md` for detailed instructions.

### Manual Deployment

```bash
npm run build
# Deploy /dist folder to your hosting service
```

## Performance Optimizations

- Code splitting for vendor libraries
- Lazy loading of chart libraries
- Asset minification with Terser
- CSS optimization with Tailwind
- Responsive image handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Real backend API integration
- User authentication with JWT
- Database for persistent storage
- Real-time health data sync
- Mobile app version
- Advanced AI analytics

## License

ISC

## Support

For issues or questions, contact: development team
