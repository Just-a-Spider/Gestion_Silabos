import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Silabos UDH',
  description: 'Compendio de Sílabos de la Universidad de Huánuco',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white h-screen antialiased  `}>
        {children}
      </body>
    </html>
  );
}
