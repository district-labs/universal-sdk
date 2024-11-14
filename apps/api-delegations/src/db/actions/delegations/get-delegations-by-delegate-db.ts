import { db } from "../../index.js";
import type { Address } from "viem";
import { DelegationDb } from "../../schema.js";

export function getDelegationsByDelegateDb({ delegate }: { delegate: Address }): Promise<DelegationDb[]>  {
  return db.query.delegations.findMany({
    where: (delegations, { eq }) => eq(delegations.delegate, delegate),
    with: {
      caveats: true,
    },
  });
}