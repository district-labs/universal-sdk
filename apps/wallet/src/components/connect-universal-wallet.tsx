'use client';

import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { useCallback } from 'react';
import { useConnect } from 'wagmi';
import { Button, buttonVariants } from './ui/button';

type ConnectUniversalWalletButton = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof buttonVariants>;

const ConnectUniversalWalletButton = ({
  children,
  className,
  size = 'default',
  rounded = 'default',
  variant = 'default',
}: ConnectUniversalWalletButton) => {
  const { connectors, connect } = useConnect();
  const createWallet = useCallback(() => {
    const universalWalletConnector = connectors.find(
      (connector) => connector.id === 'universalWalletSDK',
    );

    if (universalWalletConnector) {
      connect({ connector: universalWalletConnector });
    }
  }, [connectors, connect]);

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      rounded={rounded}
      className={cn('rounded-full', className)}
      onClick={createWallet}
    >
      {children}
    </Button>
  );
};
export { ConnectUniversalWalletButton };
