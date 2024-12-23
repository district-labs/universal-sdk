import {
  isValidChain,
  universalDeployments,
  universalResolverAbi,
} from 'universal-data';
import type { PostDid } from './validation/did.js';
import { getPublicClient } from './viem/index.js';

export function getIdentifier(did: PostDid) {
  if (!isValidChain(did.chainId)) {
    throw new Error('Invalid chain ID');
  }
  const publicClient = getPublicClient(did.chainId);
  const resolver = universalDeployments.Resolver;
  if (!resolver) {
    throw new Error(`Invalid resolver address ad chainId: ${did.chainId}`);
  }

  return publicClient.readContract({
    address: resolver,
    abi: universalResolverAbi,
    functionName: 'getIdentifierAddress',
    args: [did.address],
  });
}
