import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { jwt, type JwtVariables } from 'hono/jwt';
import type { JwtPayloadType } from '@server/types';
import { ApplicationService } from '@server/services';
import {
	clientAddProductModel,
	clientUpdateProductModel,
	type clientAddProductModelType,
	type clientUpdateProductModelType,
} from '@server/types';

export const appRoutes = new Hono<{ Variables: JwtVariables }>();

appRoutes.use(
	'/products/*',
	jwt({
		secret: process.env.JWT_SECRET ?? 'secret',
		alg: 'HS256',
		cookie: 'access_token',
	}),
);

appRoutes.use(
	'/schedules/*',
	jwt({
		secret: process.env.JWT_SECRET ?? 'secret',
		alg: 'HS256',
		cookie: 'access_token',
	}),
);

appRoutes
	// Get Users Products
	.get('/products', async (ctx) => {
		const payload: JwtPayloadType = ctx.get('jwtPayload');
		const query = await ctx.req.query();

		if (query.getFavorites) {
			const shouldGetFaves = query.getFavorites.toLowerCase() === 'true';
			if (shouldGetFaves) {
				const products = await ApplicationService.getUsersFavoriteProducts(payload.userId);
				ctx.status(200);
				return ctx.json(products);
			} else {
				const products = await ApplicationService.getUsersProducts(payload.userId);
				ctx.status(200);
				return ctx.json(products);
			}
		} else {
			const products = await ApplicationService.getUsersProducts(payload.userId);
			ctx.status(200);
			return ctx.json(products);
		}
	})
	// Add new Product for User
	.post('/products', zValidator('json', clientAddProductModel), async (ctx) => {
		const payload: JwtPayloadType = ctx.get('jwtPayload');
		const validatedData: clientAddProductModelType = ctx.req.valid('json');

		if (payload.userId !== validatedData.user_id)
			throw new HTTPException(400, { message: 'Invalid user id', cause: 'Invalid user id' });

		const product = await ApplicationService.addNewProduct(validatedData);
		ctx.status(201);
		return ctx.json(product);
	})
	// Update Product for User
	.put('/products', zValidator('json', clientUpdateProductModel), async (ctx) => {
		const payload: JwtPayloadType = ctx.get('jwtPayload');
		const validatedData: clientUpdateProductModelType = ctx.req.valid('json');

		if (payload.userId !== validatedData.user_id)
			throw new HTTPException(400, { message: 'Invalid user id', cause: 'Invalid user id' });
		await ApplicationService.updateProduct(validatedData, validatedData.product_id as number);
		ctx.status(200);
		return ctx.json({
			message: 'Product updated successfully',
		});
	});

appRoutes
	// Get Users Schedules
	.get('/schedules', async (ctx) => {
		const payload: JwtPayloadType = ctx.get('jwtPayload');

		// const schedules = await ApplicationService.getUsersSchedules(payload.userId);
	});
