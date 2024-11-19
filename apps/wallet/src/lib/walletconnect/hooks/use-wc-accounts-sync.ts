import { useEffect, useMemo } from 'react';
import { universalWalletConnectorId } from 'universal-wallet-connector';
import { useAccount } from 'wagmi';
import { useWalletKitClient } from './use-wallet-kit-client';
import type { Address } from 'viem';
import { supportedChainIdsWc } from '../constants';

/**
 * Hook for handling account changes from Universal Wallet accounts with WalletConnect.
 */
export function useWcAccountsSync() {
  const { data: walletKitClient } = useWalletKitClient();
  const { address, connector } = useAccount();

  const universalWalletAccount = useMemo(() => {
    if (!address || connector?.id !== universalWalletConnectorId) return;

    return address;
  }, [address, connector]);

  // Call the onAccountChange callback when the account changes.
  useEffect(() => {
    if (!walletKitClient || !universalWalletAccount) return;

    async function updateWalletAccount(universalWalletAccount: Address) {
      if (!walletKitClient) return;
      const sessions = Object.values(walletKitClient.getActiveSessions());

      if (sessions.length === 0) return;

      for (const session of sessions) {
        const previousNamespaces = session.namespaces;
        const namespaces = {
          ...previousNamespaces,
          eip155: {
            ...previousNamespaces.eip155,
            accounts: supportedChainIdsWc.map(
              (chainId) => `eip155:${chainId}:${universalWalletAccount}`,
            ),
          },
        };
        await walletKitClient.updateSession({
          topic: session.topic,
          namespaces,
        });
      }
    }

    updateWalletAccount(universalWalletAccount).catch(console.error);
  }, [walletKitClient, universalWalletAccount]);

  return universalWalletAccount;
}
