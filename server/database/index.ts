import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "@server/database/schemas";
const sqlite = new Database(process.env.DATABASE || "pricetracker.sqlite");

export const db = drizzle(sqlite, { schema });
