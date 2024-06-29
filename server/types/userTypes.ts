import { insertUserModel, selectUserModel, updateUserModel } from '@server/database/schemas';
import { z } from 'zod';

export const createUserModel = insertUserModel.omit({
	user_id: true,
	created_at: true,
	updated_at: true,
});

export const createUpdateUserModel = updateUserModel.omit({
	user_id: true,
	created_at: true,
	updated_at: true,
});

export type selectUserModelType = z.infer<typeof selectUserModel>;

export type createUserModelType = z.infer<typeof createUserModel>;
export type updateUserModelType = z.infer<typeof updateUserModel>;
