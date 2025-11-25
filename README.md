# Cloudflare Status Dashboard

A real-time, NOC-style status dashboard for monitoring Cloudflare's global infrastructure. Built with Next.js and designed for network operations centers, IT teams, and anyone who needs to keep an eye on Cloudflare's service health.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)
[![GitHub Issues](https://img.shields.io/github/issues/wbfoss/cf-status-dashboard)](https://github.com/wbfoss/cf-status-dashboard/issues)
[![GitHub Stars](https://img.shields.io/github/stars/wbfoss/cf-status-dashboard)](https://github.com/wbfoss/cf-status-dashboard/stargazers)

## Features

### Real-Time Monitoring
- **Live Status Updates** - Auto-refreshes every hour with manual refresh option
- **343+ Data Centers** - Complete coverage of Cloudflare's global network
- **110+ Core Services** - Monitor all Cloudflare products and services

### Interactive World Map
- **Global Visualization** - See all data centers on an interactive map
- **Region Filtering** - Filter by continent (Americas, Europe, Asia, Africa, Oceania)
- **Status Indicators** - Color-coded markers with glow effects for issues
- **Zoom & Pan** - Navigate the map with intuitive controls

### Status Overview
- **Network Health Percentage** - At-a-glance health metric
- **Active Incidents** - Real-time incident tracking
- **Scheduled Maintenance** - Upcoming maintenance windows
- **Status Breakdown** - Visual progress bar showing operational vs affected

### Detailed Views
- **Data Centers Page** - Searchable, filterable list of all 343 data centers
- **Services Page** - Complete list of core services sorted by status priority

### User Experience
- **Dark Theme** - NOC-optimized dark interface
- **Local Timezone** - Timestamps displayed in your local timezone
- **Mobile Responsive** - Works on desktop, tablet, and mobile
- **Accessibility** - Keyboard navigable with screen reader support

## Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/wbfoss/cf-status-dashboard.git

# Navigate to the project
cd cf-status-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wbfoss/cf-status-dashboard)

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### Other Platforms
- **Netlify** - Works out of the box with Next.js adapter
- **AWS Amplify** - Supports Next.js SSG
- **Cloudflare Pages** - Ironic but works great!

## Project Structure

```
cf-status-dashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Main dashboard
│   │   ├── services/          # Services list page
│   │   └── datacenters/       # Data centers list page
│   ├── components/            # React components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── StatusSummary.tsx  # Status overview card
│   │   ├── WorldMap.tsx       # Interactive map
│   │   ├── IncidentsPanel.tsx # Active incidents
│   │   └── MaintenancePanel.tsx
│   └── lib/                   # Utilities and data
│       ├── api.ts             # Cloudflare API integration
│       ├── types.ts           # TypeScript definitions
│       └── datacenters.ts     # DC coordinates mapping
├── public/                    # Static assets
└── package.json
```

## Configuration

### Environment Variables

No environment variables required! The dashboard fetches data directly from Cloudflare's public status API.

### Customization

**Refresh Interval** - Edit `src/lib/api.ts`:
```typescript
const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour (in milliseconds)
```

**Theme Colors** - Edit `src/app/globals.css`:
```css
:root {
  --noc-operational: #3fb950;
  --noc-degraded: #d29922;
  --noc-major: #f85149;
  /* ... */
}
```

## API Reference

This dashboard consumes Cloudflare's public Status API:

| Endpoint | Description |
|----------|-------------|
| `/api/v2/summary.json` | Overall status, components, incidents |
| `/api/v2/components.json` | All components and their status |
| `/api/v2/incidents.json` | Current and past incidents |

Data is fetched client-side using [SWR](https://swr.vercel.app/) for efficient caching and revalidation.

## Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Ways to Contribute
- Report bugs via [GitHub Issues](https://github.com/wbfoss/cf-status-dashboard/issues)
- Suggest features or improvements
- Submit pull requests
- Improve documentation
- Add missing data center coordinates

### Development

```bash
# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Run type checking
npm run lint

# Build for production
npm run build
```

## Roadmap

- [ ] Custom status page embedding
- [ ] Multi-provider support (AWS, GCP, Azure)
- [ ] Localization (i18n)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Data provided by [Cloudflare Status](https://www.cloudflarestatus.com)
- Built with [Next.js](https://nextjs.org)
- Maps powered by [react-simple-maps](https://www.react-simple-maps.io)
- Icons from [Heroicons](https://heroicons.com)

## Support

- **Issues & Bugs**: [GitHub Issues](https://github.com/wbfoss/cf-status-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/wbfoss/cf-status-dashboard/discussions)

---

An open source project by [wbfoss.org](https://wbfoss.org)

*Not affiliated with Cloudflare, Inc. This is an independent community project.*
