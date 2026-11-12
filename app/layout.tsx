import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'CRYPTERRA — Decode the unknown', description: 'Enter a world of cryptographic mysteries. Crack ciphers, explore the grid, and uncover digital treasures.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
