import { Hono } from 'hono';
import { jwt } from 'hono/jwt';

export const schedulesRoute = new Hono()
	.use(
		'*',
		jwt({
			secret: process.env.JWT_SECRET ?? 'secret',
			alg: 'HS256',
			cookie: 'access_token',
		}),
	)
	.get('/', (ctx) => {
		return ctx.json({ message: 'Get Schedules World!' });
	})
	.post('/', async (ctx) => {
		return ctx.json({ message: 'Post Schedules World!' });
	})
	.put('/', (ctx) => {
		return ctx.json({ message: 'Put Schedules World!' });
	})
	.delete('/', (ctx) => {
		return ctx.json({ message: 'Delete Schedules World!' });
	});
