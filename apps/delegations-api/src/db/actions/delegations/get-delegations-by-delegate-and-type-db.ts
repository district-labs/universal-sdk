import { and } from "drizzle-orm";
import { db } from "../../index.js";
import type { Address } from "viem";
import { DelegationDb } from "../../schema.js";

export function getDelegationsByDelegateAndTypeDb({ delegate, type }: { delegate: Address, type: string }): Promise<DelegationDb[]> {
  return db.query.delegations.findMany({
    where: (delegations, { eq }) => and(
        eq(delegations.delegate, delegate),
        eq(delegations.type, type)
    ),
    with: {
      caveats: true,
    },
  });
}