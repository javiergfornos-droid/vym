import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'VYM | Vector Your Model',
  description: 'Premium bilingual financial valuation experience.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
