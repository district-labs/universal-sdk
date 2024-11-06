import { useMemo, type HTMLAttributes } from 'react';
import type { Address as AddressType, Chain } from 'viem';

import { LinkComponent } from '../ui/link-component';
import { baseSepolia } from 'viem/chains';

interface AddressProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  address: AddressType;
  truncate?: boolean;
  truncateLength?: number;
  isLink?: boolean;
  chain?: Chain;
}

export const Address = ({
  address,
  className,
  truncate,
  truncateLength = 8,
  isLink,
  chain = baseSepolia,
  ...props
}: AddressProps) => {
  const blockExplorerUrl = chain.blockExplorers?.default.url;
  const formattedAddress = useMemo(
    () =>
      truncate
        ? `${address?.slice(0, truncateLength)}...${address?.slice(-(truncateLength - 2))}`
        : address,
    [address, truncate, truncateLength],
  );

  if (isLink && blockExplorerUrl) {
    return (
      <LinkComponent
        isExternal={true}
        className={className}
        href={`${blockExplorerUrl}/address/${address}`}
        {...props}
      >
        {formattedAddress}
      </LinkComponent>
    );
  }

  return (
    <span className={className} {...props}>
      {formattedAddress}
    </span>
  );
};