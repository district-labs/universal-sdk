import { validChains } from 'universal-data';
import { isAddress, isHex } from 'viem';
import { z } from 'zod';

export const addressSchema = z.string().refine(isAddress, {
  message: 'Invalid address',
});

export const hexSchema = z.string().refine(isHex, {
  message: 'Invalid hex',
});

export const chainIdSchema = z.coerce
  .number()
  .refine((value) => validChains.some(({ id }) => id === value), {
    message: 'Invalid chain ID',
  });
