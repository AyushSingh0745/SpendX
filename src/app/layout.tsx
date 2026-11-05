import type { Metadata, Viewport } from 'next';
import './globals.css';
import LenisProvider from '@/components/layout/LenisProvider';

export const metadata: Metadata = {
  title: 'SpendX — Smart Money & AI Expense Tracker',
  description: 'Next-generation personal finance PWA inspired by Spendee and Apple design. Track expenses in INR (₹), monitor daily allowances, and get advice from Agnes 3.0 Flash AI.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
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
