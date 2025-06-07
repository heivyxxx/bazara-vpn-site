import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body className="bg-dark text-white font-sans min-h-screen">{children}</body>
    </html>
  );
} 