import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

export const schedulesRoute = new Hono()
  .get("/", (ctx) => {
    return ctx.json({ message: "Get Schedules World!" });
  })
  .post("/", async (ctx) => {
    return ctx.json({ message: "Post Schedules World!" });
  })
  .put("/", (ctx) => {
    return ctx.json({ message: "Put Schedules World!" });
  })
  .delete("/", (ctx) => {
    return ctx.json({ message: "Delete Schedules World!" });
  });
