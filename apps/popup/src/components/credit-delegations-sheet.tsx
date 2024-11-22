import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { DelegationExecutions } from 'app/(site)/sign/wallet-send-calls/page';
import Image from 'next/image';
import type * as React from 'react';
import { useEffect, useState } from 'react';
import type { TokenItem } from 'universal-data';
import type { DelegationDb } from 'universal-delegations-sdk';
import { useGetCredit } from 'universal-sdk';
import { type Address, parseUnits } from 'viem';
import { Address as AddressRender } from './onchain/address';
import { Toggle } from './toggle';
import { Button } from './ui/button';
import { Card, CardFooter, CardHeader } from './ui/card';
import { Input } from './ui/input';

type DelegationWithMetadata = {
  data: DelegationDb;
  metadata: {
    available: {
      amount: string;
      amountFormatted: string;
    };
    spent: {
      amount: string;
      amountFormatted: string;
    };
    limit: {
      amount: string;
      amountFormatted: string;
    };
    token: TokenItem;
  };
};

type CreditDelegationsSheet = Omit<
  React.HTMLAttributes<HTMLElement>,
  'onSelect'
> & {
  address: Address;
  onSelect: (delegation: DelegationExecutions[]) => void;
};

export const CreditDelegationsSheet = ({
  children,
  className,
  address,
  onSelect,
}: CreditDelegationsSheet) => {
  const { data } = useGetCredit({
    address,
    chainId: 84532,
  });

  const [isOpen, toggleSheet] = useState(false);
  const [delegationExecutions, setDelegationExecutions] = useState<
    DelegationExecutions[]
  >([]);

  useEffect(() => {
    if (!isOpen) {
      setDelegationExecutions([]);
    }
  }, [isOpen]);

  const handleDisableDelegation = (hash: DelegationWithMetadata['data']['hash']) => {
    setDelegationExecutions(
      delegationExecutions.filter(
        (delegationExecution) => delegationExecution.delegation.hash !== hash,
      ),
    );
  }

  const handleDelegationAmountUpdate = (hash: DelegationWithMetadata['data']['hash'], amountFormatted: string) => {
    setDelegationExecutions(
      delegationExecutions.map(
        (delegationExecution) => {
          if (delegationExecution.delegation.hash === hash) {
            return {
              ...delegationExecution,
              execution: {
                ...delegationExecution.execution,
                amountFormatted,
                amount: parseUnits(amountFormatted, delegationExecution.token.decimals),
              }
            }
          }
          return delegationExecution;
        }
      ),
    );
  }

  const handleEnableDelegation = (
    delegationExecution: DelegationWithMetadata,
  ) => {
    setDelegationExecutions([
      ...delegationExecutions,
      {
        delegation: delegationExecution.data,
        execution: {
          hash: delegationExecution.data.hash,
          amount: BigInt(0),
          amountFormatted: "0",
          total: BigInt(delegationExecution.metadata.limit.amount),
          totalFormatted: delegationExecution.metadata.limit.amountFormatted,
          spentMapAfter:
            BigInt(delegationExecution.metadata.limit.amount) -
            BigInt(delegationExecution.metadata.spent.amount),
          spentMapAfterFormatted:
            delegationExecution.metadata.limit.amountFormatted,
        },
        token: delegationExecution.metadata.token,
      },
    ]);
  };

  const handleOnSelect = () => {
    onSelect(delegationExecutions);
    toggleSheet(false);
  };

  return (
    <div className={cn(className)}>
      <Sheet open={isOpen}>
        <SheetTrigger asChild={true} onClick={() => toggleSheet(!isOpen)}>
          {children}
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="top-6 space-y-3 overflow-auto pt-2 pb-20"
        >
          <SheetHeader>
            <SheetTitle className="text-2xl">Credit Lines</SheetTitle>
            <SheetDescription className="text-base">
              Select a credit line to use for this transaction.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {data?.credit.map((delegation) => (
              <CreditDelegationCard
                toggleSheet={toggleSheet}
                onSelect={handleEnableDelegation}
                handleDisableDelegation={handleDisableDelegation}
                handleDelegationAmountUpdate={handleDelegationAmountUpdate}
                key={delegation.data.hash}
                delegationWithMetadata={delegation}
                delegation={delegation.data}
              />
            ))}
          </div>
          <div className='fixed right-0 bottom-0 left-0 flex gap-x-4 border-t-2 bg-white px-4 py-3'>
            <Button
              onClick={() => {
                onSelect([]);
                toggleSheet(false);
              }}
              variant={'outline'}
              className="w-full rounded-full"
            >
              Cancel
            </Button>
            <Button onClick={handleOnSelect} className="w-full rounded-full">
              Apply Credit
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

type CreditDelegationCard = Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> & {
  delegation: DelegationDb;
  delegationWithMetadata: DelegationWithMetadata;
  onSelect: (delegation: DelegationWithMetadata) => void;
  handleDisableDelegation: (hash: DelegationDb['hash']) => void;
  handleDelegationAmountUpdate: (hash: DelegationDb['hash'], amountFormatted: string) => void;
  toggleSheet: (isOpen: boolean) => void;
};

const CreditDelegationCard = ({
  delegation,
  delegationWithMetadata,
  onSelect,
  handleDisableDelegation,
  handleDelegationAmountUpdate
}: CreditDelegationCard) => {
  const [isEnabled, setIsEnabled] = useState<boolean>();
  const [ pullAmount, setPullAmount ] = useState<string>()

  return (
    <Card
      key={delegation.hash}
      className={cn('flex flex-col gap-y-3 px-3 pt-0 pb-2 hover:shadow-md', {
        'border-neutral-400': isEnabled,
      })}
    >
      <CardHeader
        className={cn('flex flex-row items-start justify-between p-0', {
          'opacity-60': !isEnabled,
        })}
      >
        <div className={cn('mt-4 flex flex-col gap-y-2')}>
          <div className="flex items-center gap-x-1">
            <Image
              width={20}
              height={20}
              className="size-6 rounded-full"
              src={delegationWithMetadata.metadata.token.logoURI}
              alt={delegationWithMetadata.metadata.token.name}
            />
            <div className="space-y-0">
              <h3 className="font-black text-2xl leading-3">{`${delegationWithMetadata.metadata.token.symbol}`}</h3>
            </div>
          </div>
          <span className="font-semibold text-xs">Details</span>
        </div>
        <div className="flex flex-col items-end justify-start space-y-1">
          <span className="font-bold text-4xl">
            <Input
              disabled={!isEnabled}
              placeholder="0.0"
              value={pullAmount}
              onChange={(e) => {
                setPullAmount(e.target.value);
                handleDelegationAmountUpdate(delegationWithMetadata.data.hash, e.target.value || '0');
              }}
              className="max-w-[200px] border-transparent pr-0 text-right text-4xl shadow-none focus-visible:ring-0"
            />
          </span>
          <div className="flex items-center gap-x-0.5">
            <span className="font-semibold text-xs">{`${delegationWithMetadata.metadata.available.amountFormatted} ${delegationWithMetadata.metadata.token.symbol}`}</span>
            <span className="bg-neutral-100 p-1 text-xs">Max</span>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex items-center justify-between border-t-2 p-0 pt-2">
        <div className="flex items-center gap-x-1">
          <AddressRender
            className="text-xs"
            truncate={true}
            address={delegationWithMetadata.data.delegator}
          />
        </div>
        <div className="flex items-center gap-x-1">
          {isEnabled ? (
            <span className="font-bold text-xs">Enabled</span>
          ) : (
            <span className="text-xs">Disabled</span>
          )}
          <Toggle
            label=""
            handleIsTriggered={(isEnabled) => {
              isEnabled ? onSelect(delegationWithMetadata) : handleDisableDelegation(delegationWithMetadata.data.hash);
              setIsEnabled(isEnabled);
            }}
          />
        </div>
      </CardFooter>
    </Card>
  );
};
