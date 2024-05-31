import { UserService } from "./services";

const username = process.env.ADMIN_USERNAME || "admin";
const email = process.env.ADMIN_EMAIL || "amgookool@hotmail.com";
const password = process.env.ADMIN_PASSWORD || "P@ssword123!";

const migrateUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    console.log("migrating user:", username, "...");
    await UserService.migrateUser(username, email, password);
  } catch (e) {
    const error = e as Error;
    console.warn(`Error migrating user:${error.message}`);
  }
};

export const performMigrations = async () => {
  await migrateUser(username, email, password);
};
