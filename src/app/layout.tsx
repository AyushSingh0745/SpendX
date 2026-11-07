import type { Metadata, Viewport } from 'next';
import './globals.css';
import LenisProvider from '@/components/layout/LenisProvider';

export const metadata: Metadata = {
  title: 'SpendX — Financial Intelligence & Expense Tracker',
  description: 'Smart personal finance and AI-guided money manager inspired by Copilot and Apple design. Track expenses in INR (₹), monitor daily allowances, and audit category budgets.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col font-sans bg-black text-zinc-100 selection:bg-zinc-800 selection:text-white">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
