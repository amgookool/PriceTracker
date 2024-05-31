import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  schema: "./server/database/schemas/tables.ts",
  dbCredentials: {
    url: `${process.env.DATABASE || "database.sqlite"}`,
  },
  out: "./.drizzle",
  verbose: true,
  strict: true,
});
