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
      <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--noc-text-primary)' }}>
        About This Dashboard
      </h2>

      <div className="text-sm space-y-3" style={{ color: 'var(--noc-text-secondary)' }}>
        <p className="leading-relaxed">
          This dashboard visualizes data from{' '}
          <a
            href="https://www.cloudflarestatus.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: 'var(--noc-accent)' }}
          >
            cloudflarestatus.com
          </a>
          {' '}APIs in a NOC-style interface. As fans of Cloudflare and their incredible global
          infrastructure, we built this as a simple way to monitor their network status.
        </p>

        <p className="leading-relaxed">
          Thank you to{' '}
          <a
            href="https://cloudflare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: 'var(--noc-accent)' }}
          >
            Cloudflare
          </a>
          {' '}for providing public status APIs and for building an amazing platform that
          powers so much of the internet.
        </p>

        <p className="text-xs pt-2" style={{ color: 'var(--noc-text-muted)' }}>
          *Data refreshes every 30 minutes. This is an open source project by{' '}
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
    </section>
  );
}
