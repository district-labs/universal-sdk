import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env.js';
import * as schema from './schema.js';

const client = postgres(env.UNIVERSAL_DATABASE_URL);
export const db = drizzle(client, { schema });
