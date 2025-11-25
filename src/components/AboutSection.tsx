'use client';

export default function AboutSection() {
  return (
    <section
      className="rounded-xl border p-6 mt-6"
      style={{
        backgroundColor: 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--noc-text-primary)' }}>
        About This Dashboard
      </h2>

      <div className="grid md:grid-cols-2 gap-6 text-sm" style={{ color: 'var(--noc-text-secondary)' }}>
        <div>
          <h3 className="font-medium mb-2" style={{ color: 'var(--noc-text-primary)' }}>
            Real-Time Cloudflare Status Monitoring
          </h3>
          <p className="leading-relaxed mb-3">
            This dashboard provides real-time monitoring of Cloudflare&apos;s global infrastructure,
            including over 300 data centers worldwide. Track the operational status of Cloudflare&apos;s
            CDN, DNS, SSL, Workers, Pages, R2 Storage, and other core services.
          </p>
          <p className="leading-relaxed">
            Stay informed about active incidents, scheduled maintenance windows, and service
            degradations affecting Cloudflare&apos;s network. The dashboard automatically refreshes
            every 30 minutes to ensure you have the latest status information.
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-2" style={{ color: 'var(--noc-text-primary)' }}>
            Features
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--noc-operational)' }}>•</span>
              <span>Interactive world map showing all Cloudflare data center locations</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--noc-operational)' }}>•</span>
              <span>Real-time status updates for 300+ global data centers</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--noc-operational)' }}>•</span>
              <span>Active incident tracking with detailed timeline</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--noc-operational)' }}>•</span>
              <span>Scheduled maintenance notifications</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--noc-operational)' }}>•</span>
              <span>Core services monitoring (CDN, DNS, Workers, Pages, R2, etc.)</span>
            </li>
          </ul>

          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--noc-border)' }}>
            <p className="text-xs" style={{ color: 'var(--noc-text-muted)' }}>
              Data sourced from{' '}
              <a
                href="https://www.cloudflarestatus.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: 'var(--noc-accent)' }}
              >
                cloudflarestatus.com
              </a>
              . This is an open source project by{' '}
              <a
                href="https://wbfoss.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: 'var(--noc-accent)' }}
              >
                wbfoss.org
              </a>
              {' '}and is not affiliated with Cloudflare, Inc.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
