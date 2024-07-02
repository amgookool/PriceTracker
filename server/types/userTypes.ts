import { insertUserSchema, selectUserSchema, updateUserSchema } from '@server/database/schemas';
import { z } from 'zod';

export const createUserModel = insertUserSchema.omit({
	user_id: true,
	created_at: true,
	updated_at: true,
});

export const updateUserModel = updateUserSchema.omit({
	user_id: true,
	created_at: true,
	updated_at: true,
});
export const readUserModel = selectUserSchema;

export type readUserModelType = z.infer<typeof readUserModel>;
export type createUserModelType = z.infer<typeof createUserModel>;
export type updateUserModelType = z.infer<typeof updateUserModel>;
