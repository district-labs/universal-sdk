'use client';

import { ConnectButton as ConnectButtonRainbowkit } from '@rainbow-me/rainbowkit';
import type { VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import type { HTMLAttributes } from 'react';

import { truncateEthAddress } from '@/lib/utils';

import { Button, type buttonVariants } from '../ui/button';

interface ConnectButtonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonVariants> {
  classNameConnect?: string;
  classNameConnected?: string;
  classNameWrongNetwork?: string;
  labelConnect?: string;
  labelWrongNetwork?: string;
  displayProfile?: boolean;
  onClick?: () => void;
  onConnectClick?: () => void;
  onConnected?: () => void;
  enableChainView?: boolean;
}

export const ConnectButton = ({
  className,
  classNameConnect,
  children,
  displayProfile = true,
  labelConnect = 'Connect',
  labelWrongNetwork = 'Wrong Network',
  onConnectClick,
  onClick,
  enableChainView,
  ...props
}: ConnectButtonProps) => {
  return (
    <ConnectButtonRainbowkit.Custom>
      {({
        account,
        chain,
        mounted,
        openChainModal,
        openAccountModal,
        openConnectModal,
        authenticationStatus,
      }) => {
        const connected =
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        const handleConnectClick = () => {
          onConnectClick?.();
          openConnectModal();
        };

        return (
          <span className={className} {...props}>
            {(() => {
              if (!connected || !displayProfile) {
                return (
                  <Button
                    disabled={!mounted}
                    type="button"
                    variant={props?.variant}
                    size={props?.size}
                    rounded={props?.rounded}
                    className={classNameConnect}
                    onClick={handleConnectClick}
                  >
                    {children || labelConnect}
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    disabled={!mounted}
                    type="button"
                    variant="destructive"
                    size={props?.size}
                    rounded={props?.rounded}
                    onClick={onClick ?? openChainModal}
                  >
                    {labelWrongNetwork}
                  </Button>
                );
              }

              return (
                <div className="flex w-full items-center gap-x-2">
                  <Button
                    disabled={!mounted}
                    type="button"
                    variant={'outline'}
                    className="flex w-full gap-x-1 text-sm"
                    onClick={onClick ?? openAccountModal}
                  >
                    <div>
                      {account?.ensName ?? truncateEthAddress(account?.address)}
                    </div>
                  </Button>
                  {enableChainView && (
                    <Button
                      disabled={!mounted}
                      type="button"
                      variant={'outline'}
                      onClick={onClick ?? openChainModal}
                    >
                      <Image
                        alt={chain.name ?? 'Chain icon'}
                        width={26}
                        height={26}
                        src={chain?.iconUrl as string}
                        className="mx-0"
                      />
                    </Button>
                  )}
                </div>
              );
            })()}
          </span>
        );
      }}
    </ConnectButtonRainbowkit.Custom>
  );
};
