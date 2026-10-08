import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'MainQuest',
  description: 'Stop doing side quests. Finish the main quest.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-base text-text-primary font-body min-h-screen">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
