import { zValidator } from '@hono/zod-validator';
import { ScheduleService } from '@server/services';
import { createScheduleModel, updateScheduleModel, type JwtPayloadType } from '@server/types';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { jwt, type JwtVariables } from 'hono/jwt';

export const schedulesRoute = new Hono<{ Variables: JwtVariables }>()
	.use(
		'*',
		jwt({
			secret: process.env.JWT_SECRET ?? 'secret',
			alg: 'HS256',
			cookie: 'access_token',
		}),
	)
	.get('/', (ctx) => {
		const payload: JwtPayloadType = ctx.get('jwtPayload');
		try {
			const results = ScheduleService.getSchedulesByUserId(payload.userId);
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
	.post('/', zValidator('json', createScheduleModel), async (ctx) => {
		const payload = ctx.get('jwtPayload');
		const newSchedule = await ctx.req.valid('json');
		try {
			console.log(`Adding Schedule for user: ${payload.userId}`);
			const result = await ScheduleService.createSchedule(newSchedule);
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
	.put('/', zValidator('json', updateScheduleModel), (ctx) => {
		return ctx.json({ message: 'Put Schedules World!' });
	})
	.delete('/', (ctx) => {
		return ctx.json({ message: 'Delete Schedules World!' });
	})
	.get('/all', async (ctx) => {
		try {
			const payload: JwtPayloadType = ctx.get('jwtPayload');
			if (payload.role !== 'ADMIN') {
				throw new Error('Unauthorized: Only admins can access this route');
			} else {
				const results = await ScheduleService.getAllSchedules();
				ctx.status(200);
				return ctx.json(results);
			}
		} catch (e) {
			const error = e as Error;
			console.error(error.message);
			throw new HTTPException(500, {
				message: `${error.message}`,
				cause: error,
			});
		}
	});
