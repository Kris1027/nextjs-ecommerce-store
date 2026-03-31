'use client';

import { useEffect } from 'react';
import Link from 'next/link';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang='en'>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: '1.5rem',
            textAlign: 'center',
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '4rem' }}>⚠</div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              Something went wrong
            </h1>
            <p
              style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                marginTop: '0.5rem',
              }}
            >
              A critical error occurred. Please try again.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={reset}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: '#171717',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Try Again
            </button>
            <Link
              href='/'
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb',
                backgroundColor: 'transparent',
                color: '#171717',
                textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
