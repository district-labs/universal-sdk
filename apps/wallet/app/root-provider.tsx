'use client';
import { ConfirmationDialogProvider } from '@/components/confirmation-dialog-provider';
import { env } from '@/env';
import { wagmiConfig } from '@/lib/wagmi/wagmi-config';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { DelegationsApiClientProvider } from 'universal-delegations-sdk';
import { UniversalIdentityClientProvider } from 'universal-identity-sdk';
import { WagmiProvider } from 'wagmi';
const queryClient = new QueryClient();

type RootProviderProps = {
  children: ReactNode;
};

export default function RootProvider({ children }: RootProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      disableTransitionOnChange={true}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <UniversalIdentityClientProvider
              url={env.NEXT_PUBLIC_IDENTITY_API_URL}
            >
              <DelegationsApiClientProvider
                url={env.NEXT_PUBLIC_DELEGATIONS_API_URL}
              >
                <ConfirmationDialogProvider>
                  {children}
                </ConfirmationDialogProvider>
              </DelegationsApiClientProvider>
            </UniversalIdentityClientProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
