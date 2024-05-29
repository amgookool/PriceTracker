import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { jwt } from "hono/jwt";
import { csrf } from "hono/csrf";

const migrateUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    console.log("migrate user");
  } catch (e) {
    const error = e as Error;
    console.error(`Error Occured migrating user:${error.message}`);
  }
};

const app = new Hono();
app.use(csrf());
app.use("*", logger());
app.use(trimTrailingSlash());

const apiRoutes = app
  .basePath("/api")
  .route("/products")
  .route("/users")
  .route("/schedules")
  .route("/auth");

app.get("*", serveStatic({root:"./frontend/dist"}))
app.get("*",serveStatic({path:"./frontend/dist/index.html"}))

export default app;
export type ApiRoutes = typeof apiRoutes;
