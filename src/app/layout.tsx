import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'MainQuest',
  description: 'Stop doing side quests. Finish the main quest.',
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className="bg-base text-text-primary font-body min-h-screen"
        style={{
          '--mainquest-hero-image': `url("${basePath}/images/mainquest-dawn-cabin.png")`,
        } as React.CSSProperties}
      >
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
