import { db } from '@server/database/index.ts';
import { UsersTable } from '@server/database/schemas';
import type { selectUserModelType } from '@server/types';
import { eq } from 'drizzle-orm';
import { decode, sign, verify } from 'hono/jwt';

export const login = async (username: string, password: string) => {
	const user = await db
		.select()
		.from(UsersTable)
		.where(eq(UsersTable.username, username))
		.then((res) => res[0] as selectUserModelType);

	if (!user) throw new Error('User not found');

	const passwordMatch = await Bun.password.verify(password, user.password);
	if (!passwordMatch) throw new Error('Incorrect password');
	const expire_mins = parseInt(process.env.JWT_EXPIRE_MINS as string) || 20;

	const payload = {
		userId: user.user_id,
		username: user.username,
		email: user.email,
		role: user.role,
		exp: Math.floor(Date.now() / 1000) + 60 * expire_mins, // Token expires in minutes
	};

	const token = await sign(payload, process.env.JWT_SECRET || 'secret', 'HS256');
	return {
		token,
		username: user.username,
		email: user.email,
		userId: user.user_id,
		role: user.role,
	};
};

export const verifyToken = async (token: string) => {
	const decodedPayload = await verify(token, process.env.JWT_SECRET || 'secret', 'HS256');
	return decodedPayload as {
		userId: number;
		username: string;
		email: string;
		role: string;
		exp: number;
	};
};

export const decodeToken = async (token: string) => {
	const { header, payload } = await decode(token);
	return { header, payload };
};
