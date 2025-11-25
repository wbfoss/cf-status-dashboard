# Cloudflare Status Dashboard

A real-time dashboard displaying Cloudflare service status, incidents, and scheduled maintenance.

## Features

- **Real-time Status**: Shows overall Cloudflare system status
- **Component Monitoring**: Displays status of all Cloudflare components
- **Active Incidents**: Lists any ongoing incidents with updates
- **Scheduled Maintenance**: Shows upcoming and active maintenance windows
- **Auto-refresh**: Updates every 5 minutes automatically
- **Manual Refresh**: Click the refresh button for immediate updates
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- Pure HTML, CSS, and JavaScript (no frameworks)
- Fetches data from [Cloudflare Status API](https://www.cloudflarestatus.com/api)
- Static site - no server required

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy - no configuration needed

### Local Development

```bash
npx serve .
```

Then open http://localhost:3000

## API Reference

See [understanding.md](./understanding.md) for complete Cloudflare Status API documentation.

## License

MIT
