import { UserService } from "./services";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "@server/database";

const username = process.env.ADMIN_USERNAME || "admin";
const email = process.env.ADMIN_EMAIL || "amgookool@hotmail.com";
const password = process.env.ADMIN_PASSWORD || "P@ssword123!";

const migrateUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    console.log("migrate user:", username);
    await UserService.migrateUser(username, email, password);
  } catch (e) {
    const error = e as Error;
    console.error(`Error Occured migrating user:${error.message}`);
  }
};

await migrateUser(username, email, password);

