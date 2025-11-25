'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useCloudflareStatus } from '@/lib/api';

// Dynamically import Globe3D to avoid SSR issues with Three.js
const Globe3D = dynamic(() => import('@/components/Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#000' }}>
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-2 border-t-transparent rounded-full mx-auto mb-4" style={{ borderColor: 'var(--noc-accent)', borderTopColor: 'transparent' }} />
        <p className="text-sm" style={{ color: 'var(--noc-text-muted)' }}>Loading 3D Globe...</p>
      </div>
    </div>
  ),
});

export default function GlobePage() {
  const { data, isLoading, isError, refresh } = useCloudflareStatus();

  const components = data?.components || [];

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#000' }}>
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--noc-major)' }}>
            Connection Error
          </h2>
          <button
            onClick={() => refresh()}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--noc-accent)', color: 'white' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden" style={{ backgroundColor: '#000' }}>
      {/* Header - Floating */}
      <header
        className="absolute top-0 left-0 right-0 z-50"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity px-3 py-1.5 rounded-lg"
              style={{
                color: 'var(--noc-text-secondary)',
                backgroundColor: 'rgba(10, 14, 20, 0.7)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>

            <h1
              className="text-lg font-semibold px-4 py-1.5 rounded-lg"
              style={{
                color: 'var(--noc-text-primary)',
                backgroundColor: 'rgba(10, 14, 20, 0.7)',
                backdropFilter: 'blur(8px)',
              }}
            >
              3D Network Globe
            </h1>

            <div className="w-32" />
          </div>
        </div>
      </header>

      {/* Globe Container */}
      <div className="w-full h-full">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-10 h-10 border-2 border-t-transparent rounded-full mx-auto mb-4" style={{ borderColor: 'var(--noc-accent)', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: 'var(--noc-text-muted)' }}>Loading data centers...</p>
            </div>
          </div>
        ) : (
          <Globe3D components={components} />
        )}
      </div>
    </div>
  );
}
