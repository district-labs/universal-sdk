'use client';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { addressSchema } from '@/lib/validation/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type Address, erc20Abi, parseUnits } from 'viem';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { useWriteContracts } from 'wagmi/experimental';
import { z } from 'zod';

import { AccountSelectAndInput } from '@/components/fields/account-select-and-input';
import { Erc20SelectAndAmount } from '@/components/fields/erc20-select-and-amount';
import { ConnectUniversalWalletButton } from '@/components/onchain/connect-universal-wallet';
import { Card } from '@/components/ui/card';
import type { TokenItem } from 'universal-data';
import { tokenList } from 'universal-data';
import { baseSepolia } from 'viem/chains';

const formSchema = z.object({
  to: addressSchema,
  token: z.custom<TokenItem>(),
  amount: z.string(),
});

function FormerErc20Transfer() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isPendingSwitchChain } = useSwitchChain();
  const { data, writeContracts, error, status } = useWriteContracts();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (chainId !== baseSepolia.id) {
      switchChain({
        chainId: baseSepolia.id,
      });
      return;
    }
    writeContracts({
      contracts: [
        {
          abi: erc20Abi,
          address: data.token.address as Address,
          functionName: 'transfer',
          args: [
            data.to as Address,
            parseUnits(data.amount.toString(), data.token.decimals),
          ],
        },
      ],
    });
    form.reset({
      to: undefined,
      token: undefined,
      amount: undefined,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <Card className="rounded-3xl p-5">
          <AccountSelectAndInput />
        </Card>
        <Card className="rounded-3xl p-5">
          <Erc20SelectAndAmount tokenList={tokenList} />
        </Card>

        {address && chainId === baseSepolia.id && (
          <div className="">
            <Button
              // disabled={!form.formState.isValid}
              className="w-full py-3 text-lg"
              type="submit"
              rounded={'full'}
              variant={'emerald'}
              size={'lg'}
            >
              Transfer
            </Button>
          </div>
        )}
        {address && chainId !== baseSepolia.id && (
          <Button
            disabled={isPendingSwitchChain}
            className="w-full py-3 text-lg"
            type="submit"
            rounded={'full'}
            variant={'emerald'}
            size={'lg'}
          >
            Switch to Base Sepolia
          </Button>
        )}
        {!address && (
          <ConnectUniversalWalletButton className="w-full rounded-full py-3 text-lg">
            Connect Universal Wallet
          </ConnectUniversalWalletButton>
        )}
      </form>
    </Form>
  );
}

export { FormerErc20Transfer };
