import app from "./server/app";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "@server/database";
import { performMigrations } from "./server/migrate";

try {
  await migrate(db, { migrationsFolder: "./.drizzle" });
  await performMigrations();
} catch (exception) {
  const error = exception as Error;
  console.error(error.message);
}

const server = Bun.serve({
  port: process.env.PORT ?? 2500,
  hostname: "0.0.0.0",
  fetch: app.fetch,
});

console.log(`Server running on port:${server.port}`);
