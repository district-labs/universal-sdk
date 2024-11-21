import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema.js';

const UNIVERSAL_DATABASE_URL =
  process.env.UNIVERSAL_DATABASE_URL ||
  'postgresql://postgres:password@localhost:5432/delegations';

const client = postgres(UNIVERSAL_DATABASE_URL);
export const db = drizzle(client, { schema });
