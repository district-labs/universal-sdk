'use client';
import { AccountPopover } from '@/components/account-popover';
import { AppSidebar } from '@/components/app-sidebar';
import { CameraQrScanner } from '@/components/camera/camera-qr-scanner';
import { ConnectUniversalWalletButton } from '@/components/connect-universal-wallet';
import { ConnectButton } from '@/components/onchain/connect-button';
import { IsWalletConnected } from '@/components/onchain/is-wallet-connected';
import { IsWalletDisconnected } from '@/components/onchain/is-wallet-disconnected';
import { PWAEnvironment } from '@/components/pwa-environment';
import { QRIconReceiveDialog } from '@/components/qr-icon-receive-dialog';
import { SiteEnvironment } from '@/components/site-environment';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useWcEventsManager } from '@/lib/walletconnect/hooks/use-wc-events-manager';
import { useWcInitialization } from '@/lib/walletconnect/hooks/use-wc-initialization';
import type { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const initialized = useWcInitialization();
  useWcEventsManager(initialized);
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <header
              className={cn(
                'sticky top-0 z-50 w-full border-b-2 bg-background text-foreground transition-all lg:relative',
              )}
            >
              <div className="flex w-full items-center justify-between px-4 py-4">
                <div className="flex flex-1 items-center gap-x-1">
                  <SidebarTrigger className="size-9" />
                </div>
                <div>
                  <IsWalletConnected>
                    <div className="flex items-center gap-x-2">
                      <CameraQrScanner />
                      <QRIconReceiveDialog />
                      <AccountPopover />
                    </div>
                  </IsWalletConnected>
                  <IsWalletDisconnected>
                    <SiteEnvironment>
                      <ConnectButton rounded={'full'} />
                    </SiteEnvironment>
                    <PWAEnvironment>
                      <ConnectUniversalWalletButton>
                        Connect
                      </ConnectUniversalWalletButton>
                    </PWAEnvironment>
                  </IsWalletDisconnected>
                </div>
              </div>
            </header>
            <main className="relative z-10 flex flex-1 flex-col">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
}
