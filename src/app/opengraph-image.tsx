import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Cloudflare Status Dashboard - Real-time Global Network Monitor';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0e14',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, #1a2332 1px, transparent 0)',
            backgroundSize: '40px 40px',
            opacity: 0.5,
          }}
        />

        {/* Globe visualization representation */}
        <div
          style={{
            position: 'absolute',
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #1a3a5c 0%, #0d1a2a 50%, #050a10 100%)',
            border: '2px solid #3a86ff',
            boxShadow: '0 0 60px rgba(58, 134, 255, 0.3), inset 0 0 60px rgba(58, 134, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Dots representing data centers */}
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex' }}>
            {/* Green dots - operational */}
            <div style={{ position: 'absolute', top: '25%', left: '30%', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3fb950', boxShadow: '0 0 10px #3fb950' }} />
            <div style={{ position: 'absolute', top: '35%', left: '45%', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3fb950', boxShadow: '0 0 10px #3fb950' }} />
            <div style={{ position: 'absolute', top: '45%', left: '55%', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3fb950', boxShadow: '0 0 10px #3fb950' }} />
            <div style={{ position: 'absolute', top: '55%', left: '40%', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3fb950', boxShadow: '0 0 10px #3fb950' }} />
            <div style={{ position: 'absolute', top: '40%', left: '65%', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3fb950', boxShadow: '0 0 10px #3fb950' }} />
            <div style={{ position: 'absolute', top: '60%', left: '58%', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3fb950', boxShadow: '0 0 10px #3fb950' }} />
            <div style={{ position: 'absolute', top: '30%', left: '60%', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3fb950', boxShadow: '0 0 10px #3fb950' }} />
            <div style={{ position: 'absolute', top: '50%', left: '35%', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3fb950', boxShadow: '0 0 10px #3fb950' }} />
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, zIndex: 1, maxWidth: '650px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: '#f6821f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
                <ellipse cx="12" cy="12" rx="4" ry="10" stroke="white" strokeWidth="2" fill="none" />
                <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <span style={{ color: '#8b949e', fontSize: '24px' }}>wbfoss.org</span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#e6edf3',
              margin: 0,
              lineHeight: 1.1,
              marginBottom: '24px',
            }}
          >
            Cloudflare Status Dashboard
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '28px',
              color: '#8b949e',
              margin: 0,
              marginBottom: '40px',
            }}
          >
            Real-time 3D globe visualization of 330+ global data centers
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3fb950' }} />
              <span style={{ color: '#3fb950', fontSize: '20px', fontWeight: 600 }}>330+ Data Centers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3a86ff' }} />
              <span style={{ color: '#3a86ff', fontSize: '20px', fontWeight: 600 }}>Real-time Status</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ color: '#6e7681', fontSize: '18px' }}>cfstatusdashboard.vercel.app</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
