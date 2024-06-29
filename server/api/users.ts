import { zValidator } from '@hono/zod-validator';
import { UserService } from '@server/services';
import { createUpdateUserModel, createUserModel } from '@server/types';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const usersRoute = new Hono()
	.get('/', async (ctx) => {
		try {
			const result = await UserService.getUsers();
			ctx.status(200);
			return ctx.json(result);
		} catch (e) {
			const error = e as Error;
			console.error(error);
			throw new HTTPException(500, {
				message: `${error.message}`,
				cause: error,
			});
		}
	})
	.post('/', zValidator('json', createUserModel), async (ctx) => {
		const newUser = await ctx.req.valid('json');
		try {
			const result = await UserService.createUser(newUser);
			ctx.status(201);
			return ctx.json(result);
		} catch (e) {
			const error = e as Error;
			console.log(error.message);
			throw new HTTPException(500, {
				message: `${error.message}`,
				cause: error,
			});
		}
	})
	.get('/:userId{[0-9]+}', async (ctx) => {
		const { userId } = ctx.req.param();
		try {
			const result = await UserService.getUserById(parseInt(userId));
			ctx.status(200);
			return ctx.json(result);
		} catch (e) {
			const error = e as Error;
			console.error(error);
			throw new HTTPException(500, {
				message: `${error.message}`,
				cause: error,
			});
		}
	})
	.put('/:userId{[0-9]}', zValidator('json', createUpdateUserModel), async (ctx) => {
		const { userId } = ctx.req.param();
		const userUpdate = await ctx.req.valid('json');
		try {
			const result = await UserService.updateUser(userUpdate, parseInt(userId));
			ctx.status(202);
			return ctx.json(result);
		} catch (e) {
			const error = e as Error;
			console.error(error);
			throw new HTTPException(500, {
				message: `${error.message}`,
				cause: error,
			});
		}
	})
	.delete('/:userId{[0-9]}', async (ctx) => {
		const { userId } = ctx.req.param();
		try {
			const result = await UserService.deleteUser(parseInt(userId));
			ctx.status(202);
			return ctx.json(result);
		} catch (e) {
			const error = e as Error;
			console.error(error);
			throw new HTTPException(500, {
				message: `${error.message}`,
				cause: error,
			});
		}
	});
