import { zValidator } from "@hono/zod-validator";
import { AuthenticationService } from "@server/services";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from "hono/cookie";

const loginSchema = z.object({
  username: z.string().min(3).max(255),
  password: z.string().min(4).max(255),
});

export const authenticationRoute = new Hono().post(
  "/login",
  zValidator("json", loginSchema),
  async (ctx) => {
    const user = await ctx.req.valid("json");
    try {
      const {token, userId, username} = await AuthenticationService.login(
        user.username,
        user.password
      );
      setCookie(ctx, "access_token", token,{
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 8, // 8 hours 
      });
      return ctx.json({ token, userId, username});
    } catch (e) {
      const error = e as Error;
      throw new HTTPException(401, {
        message: `${error.message}`,
        cause: error,
      });
    }
  }
);
