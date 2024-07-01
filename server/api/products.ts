import { zValidator } from '@hono/zod-validator';
import { updateProductModel } from '@server/database/schemas';
import { ProductService } from '@server/services';
import { createProductModel } from '@server/types';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { jwt, type JwtVariables } from 'hono/jwt';

export const productsRoute = new Hono<{ Variables: JwtVariables }>()
	.use(
		'*',
		jwt({
			secret: process.env.JWT_SECRET ?? 'secret',
			alg: 'HS256',
			cookie: 'access_token',
		}),
	)
	.get('/', async (ctx) => {
		const payload = ctx.get('jwtPayload');
		try {
			const results = await ProductService.getProductsWithPriceHistory(payload?.user_id);
			ctx.status(200);
			return ctx.json(results);
		} catch (e) {
			const error = e as Error;
			console.error(error.message);
			throw new HTTPException(500, {
				message: `${error.message}`,
				cause: error,
			});
		}
	})
	.post('/', zValidator('json', createProductModel), async (ctx) => {
		const validatedData = ctx.req.valid('json');
		try {
			const result = await ProductService.addProduct(validatedData);
			ctx.status(201);
			return ctx.json(result);
		} catch (e) {
			const error = e as Error;
			console.error(error.message);
			throw new HTTPException(500, {
				message: `${error.message}`,
				cause: error,
			});
		}
	})
	.get('/:productId{[0-9]}', async (ctx) => {
		const { productId } = ctx.req.param();
		try {
			const results = await ProductService.getProductByProductId(parseInt(productId));
			ctx.status(200);
			return ctx.json(results);
		} catch (e) {
			const error = e as Error;
			console.error(error.message);
			throw new HTTPException(500, {
				message: `${error.message}`,
				cause: error,
			});
		}
	})
	.put('/:productId{[0-9]}', zValidator('json', updateProductModel), async (ctx) => {
		const { productId } = ctx.req.param();
		const validatedData = ctx.req.valid('json');
		try {
			const result = await ProductService.updateProduct(validatedData, parseInt(productId));
			ctx.status(200);
			return ctx.json(result);
		} catch (e) {
			const error = e as Error;
			console.error(error.message);
			throw new HTTPException(500, {
				message: `${error.message}`,
				cause: error,
			});
		}
	})
	.delete('/:productId{[0-9]}', async (ctx) => {
		const { productId } = ctx.req.param();
		try {
			const results = await ProductService.deleteProduct(parseInt(productId));
			ctx.status(200);
			return ctx.json(results);
		} catch (e) {
			const error = e as Error;
			console.error(error.message);
			throw new HTTPException(500, {
				message: `${error.message}`,
				cause: error,
			});
		}
	});
