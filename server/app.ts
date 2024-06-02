import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { jwt } from "hono/jwt";
import { csrf } from "hono/csrf";
import {
  authenticationRoute,
  productsRoute,
  schedulesRoute,
  usersRoute,
} from "@server/api/index";

const app = new Hono();
app.use(csrf());
app.use("*", logger());
app.use(trimTrailingSlash());
app
  .use(
    "/api/users/*",
    jwt({
      secret: process.env.JWT_SECRET || "secret",
      alg: "HS256",
      cookie: "access_token",
    })
  )
  .use(
    "/api/products/*",
    jwt({
      secret: process.env.JWT_SECRET || "secret",
      alg: "HS256",
      cookie: "access_token",
    })
  )
  .use(
    "/api/schedules/*",
    jwt({
      secret: process.env.JWT_SECRET || "secret",
      alg: "HS256",
      cookie: "access_token",
    })
  )
  .use(
    "/api/auth/logout",
    jwt({
      secret: process.env.JWT_SECRET || "secret",
      alg: "HS256",
      cookie: "access_token",
    })
  )

const apiRoutes = app
  .basePath("/api")
  .route("/products", productsRoute)
  .route("/users", usersRoute)
  .route("/schedules", schedulesRoute)
  .route("/auth", authenticationRoute);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
