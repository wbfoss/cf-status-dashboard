# Cloudflare Status Dashboard

A professional NOC-style dashboard for monitoring Cloudflare infrastructure status in real-time.

## Features

- **Real-time Status Monitoring** - Overall system status with visual indicators
- **Component Grid** - Status of all Cloudflare services at a glance
- **Active Incidents** - Live tracking of ongoing incidents with updates
- **Scheduled Maintenance** - Upcoming and in-progress maintenance windows
- **Auto-refresh** - Automatic updates every 5 minutes
- **Manual Refresh** - Instant refresh button for on-demand updates
- **NOC-style UI** - Professional dark theme optimized for monitoring displays
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR for real-time updates
- **API**: Cloudflare Status API
- **Deployment**: Vercel (static)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Deploy - zero configuration required

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main dashboard page
│   └── globals.css     # NOC theme styles
├── components/
│   ├── Header.tsx      # Navigation and refresh controls
│   ├── StatusHero.tsx  # Large status indicator
│   ├── MetricCard.tsx  # Metric display cards
│   ├── ComponentsGrid.tsx    # Service status grid
│   ├── IncidentsPanel.tsx    # Active incidents list
│   └── MaintenancePanel.tsx  # Scheduled maintenance
└── lib/
    ├── api.ts          # SWR hooks and utilities
    └── types.ts        # TypeScript definitions
```

## License

MIT
