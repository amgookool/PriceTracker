import { zValidator } from '@hono/zod-validator';
import { AuthenticationService } from '@server/services';
import { Hono } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

const loginSchema = z.object({
	username: z.string().min(3).max(255),
	password: z.string().min(4).max(255),
});

export const authenticationRoute = new Hono()
	.post('/login', zValidator('json', loginSchema), async (ctx) => {
		const user = await ctx.req.valid('json');
		try {
			const { token, userId, username, email, role } = await AuthenticationService.login(user.username, user.password);
			setCookie(ctx, 'access_token', token, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				path: '/',
				maxAge: 60 * 60 * 8, // 8 hours
			});
			return ctx.json({ token, userId, username, email, role });
		} catch (e) {
			const error = e as Error;
			throw new HTTPException(401, {
				message: `${error.message}`,
				cause: error,
			});
		}
	})
	.post('/logout', async (ctx) => {
		deleteCookie(ctx, 'access_token', {
			path: '/',
		});
		return ctx.json({ message: 'Logged out successfully' });
	})
	.post('/validate_access_token', async (ctx) => {
		const token = getCookie(ctx, 'access_token');
		if (!token) {
			throw new HTTPException(401, {
				message: 'Access token is required',
			});
		}
		try {
			const decoded = await AuthenticationService.verifyToken(token);
			return ctx.json(decoded);
		} catch (e) {
			const error = e as Error;
			throw new HTTPException(401, {
				message: `${error.message}`,
				cause: error,
			});
		}
	});
