import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { jwt, type JwtVariables } from 'hono/jwt';
import type { JwtPayloadType } from '@server/types';
import { ApplicationService } from '@server/services';
import { ScheduleService } from '@scheduler/index';
import {
	clientAddProductModel,
	clientUpdateProductModel,
	type clientAddProductModelType,
	type clientUpdateProductModelType,
} from '@server/types';

export const productRoutes = new Hono<{ Variables: JwtVariables }>()
	.use(
		'*',
		jwt({
			secret: process.env.JWT_SECRET ?? 'secret',
			alg: 'HS256',
			cookie: 'access_token',
		}),
	)
	// Get Users Products
	.get('/', async (ctx) => {
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
	.post('/', zValidator('json', clientAddProductModel), async (ctx) => {
		const payload: JwtPayloadType = ctx.get('jwtPayload');
		const validatedData: clientAddProductModelType = ctx.req.valid('json');

		if (payload.userId !== validatedData.user_id)
			throw new HTTPException(400, { message: 'Invalid user id', cause: 'Invalid user id' });

		const product = await ApplicationService.addNewProduct(validatedData);
		ctx.status(201);
		return ctx.json(product);
	})
	// Update Product for User
	.put('/:productId{[0-9]}', zValidator('json', clientUpdateProductModel), async (ctx) => {
		const payload: JwtPayloadType = ctx.get('jwtPayload');
		const { productId } = ctx.req.param();
		const validatedData: clientUpdateProductModelType = ctx.req.valid('json');

		if (payload.userId !== validatedData.user_id)
			throw new HTTPException(400, { message: 'Invalid user id', cause: 'Invalid user id' });
		await ApplicationService.updateProduct(validatedData, parseInt(productId));
		ctx.status(200);
		return ctx.json({
			message: 'Product updated successfully',
		});
	})
	// Get User Product by ID
	.get('/:productId{[0-9]}', async (ctx) => {
		const { productId } = ctx.req.param();
		const payload: JwtPayloadType = ctx.get('jwtPayload');
		const product = await ApplicationService.getProductByProductId(parseInt(productId), payload.userId);
		ctx.status(200);
		return ctx.json(product);
	});

export const scheduleRoutes = new Hono<{ Variables: JwtVariables }>()
	.use(
		'*',
		jwt({
			secret: process.env.JWT_SECRET ?? 'secret',
			alg: 'HS256',
			cookie: 'access_token',
		}),
	)
	// Admin: Get All Schedules
	.get('/', async (ctx) => {
		const payload: JwtPayloadType = ctx.get('jwtPayload');
		if (payload.role !== 'ADMIN') throw new HTTPException(400, { message: 'Invalid User Role', cause: 'Invalid User Role' });
		const result = await ApplicationService.getAllSchedules();
		ctx.status(200);
		return ctx.json(result);
	})
	// Get Schedules By User ID
	.get('/:userId{[0-9]}', async (ctx) => {
		const payload: JwtPayloadType = ctx.get('jwtPayload');
		const { userId } = ctx.req.param();
		if (payload.userId !== parseInt(userId))
			throw new HTTPException(400, { message: 'Invalid user id', cause: 'Invalid user id' });
		const schedules = await ApplicationService.getSchedulesByUserId(parseInt(userId));
		ctx.status(200);
		return ctx.json(schedules);
	})
	// Get User Schedule by Schedule ID
	.get('/:scheduleId{[0-9]}', async (ctx) => {
		const payload: JwtPayloadType = ctx.get('jwtPayload');
		const { scheduleId } = ctx.req.param();
		const result = await ApplicationService.getScheduleByScheduleIdAndUserId(parseInt(scheduleId), payload.userId);
		ctx.status(200);
		return ctx.json(result);
	})
	// Get User Schedule Status by Schedule ID
	.get('/:scheduleId{[0-9]}/status', async (ctx) => {
		const payload: JwtPayloadType = ctx.get('jwtPayload');
		const { scheduleId } = ctx.req.param();
		const result = await ApplicationService.getScheduleByScheduleIdAndUserId(parseInt(scheduleId), payload.userId);
		const jobStatus = ScheduleService.getJobStatus(result.schedule_id);
		ctx.status(200);
		return ctx.json({
			status: jobStatus,
			scheduleId: result.schedule_id,
			name: result.job_name,
			productId: result.product_id,
		});
	})
	// Stop The Schedule Job By Schedule ID
	.get('/:scheduleId{[0-9]}/stop', async (ctx) => {
		const payload: JwtPayloadType = ctx.get('jwtPayload');
		const { scheduleId } = ctx.req.param();
		const result = await ApplicationService.getScheduleByScheduleIdAndUserId(parseInt(scheduleId), payload.userId);
		const jobStatus = ScheduleService.stopJob(result.schedule_id);
		ctx.status(200);
		return ctx.json({
			status: jobStatus,
			scheduleId: result.schedule_id,
			name: result.job_name,
			productId: result.product_id,
		});
	})
	// Update the Job Schedule
	.put('/:scheduleId{[0-9]}', zValidator('json', clientUpdateProductModel), async (ctx) => {});
