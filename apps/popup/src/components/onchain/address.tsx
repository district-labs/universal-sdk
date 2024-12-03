import type { HTMLAttributes } from 'react';
import type { Address as AddressType, Chain } from 'viem';
import { productionChains } from 'universal-data';
import { LinkComponent } from '../ui/link-component';

interface AddressProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  address: AddressType;
  truncate?: boolean;
  truncateLength?: number;
  isLink?: boolean;
  chain?: Chain;
}

const defaultChain = productionChains[0];

export const Address = ({
  address,
  className,
  truncate,
  truncateLength = 8,
  isLink,
  chain = defaultChain,
  ...props
}: AddressProps) => {
  const blockExplorerUrl = chain.blockExplorers?.default.url;
  const formattedAddress = truncate
    ? `${address?.slice(0, truncateLength)}...${address?.slice(-(truncateLength - 2))}`
    : address;

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
