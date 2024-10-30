'use client';
import { Toaster } from '@/components/ui/toaster';
import { CallProvider } from '@/contexts/call-context';
import AppStateProvider from '@/contexts/app-context';

export default function RoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppStateProvider>
      <CallProvider>
        {children}
        <Toaster />
      </CallProvider>
    </AppStateProvider>
  );
}
