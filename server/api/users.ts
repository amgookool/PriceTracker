import { zValidator } from '@hono/zod-validator';
import { UserService } from '@server/services';
import { type createUserModelType, updateUserModel, createUserModel } from '@server/types';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { jwt, type JwtVariables } from 'hono/jwt';
import type { JwtPayloadType } from '@server/types';

export const usersRoute = new Hono<{ Variables: JwtVariables }>()
	.use(
		'*',
		jwt({
			secret: process.env.JWT_SECRET ?? 'secret',
			alg: 'HS256',
			cookie: 'access_token',
		}),
	)
	// Admin: Get All Users
	.get('/', async (ctx) => {
		const payload: JwtPayloadType = ctx.get('jwtPayload');
		if (payload.role !== 'ADMIN') throw new HTTPException(401, { message: 'Unauthorized' });
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
	// Admin: Create New User
	.post('/', zValidator('json', createUserModel), async (ctx) => {
		const newUserFormData = await ctx.req.valid('json');
		const payload = ctx.get('jwtPayload');
		if (payload.role !== 'ADMIN') throw new HTTPException(401, { message: 'Unauthorized' });
		const validatedData: createUserModelType = createUserModel.parse(newUserFormData);
		try {
			const result = await UserService.createUser(validatedData);
			ctx.status(201);
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
	// Admin & User: Get User
	.get('/:userId{[0-9]}', async (ctx) => {
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
	// Admin & User: Update User
	.put('/:userId{[0-9]}', zValidator('json', updateUserModel), async (ctx) => {
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
	// Admin: Delete User
	.delete('/:userId{[0-9]}', async (ctx) => {
		const { userId } = ctx.req.param();
		const payload = ctx.get('jwtPayload');
		if (payload.role !== 'ADMIN') throw new HTTPException(401, { message: 'Unauthorized' });
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
