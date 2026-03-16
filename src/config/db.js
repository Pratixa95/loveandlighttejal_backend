import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "./env.js";

/* 🔥 IMPORT ALL SCHEMAS */
import * as schema from "../db/schema/index.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

/* ✅ PASS SCHEMA HERE (MOST IMPORTANT) */
export const db = drizzle(pool, { schema });