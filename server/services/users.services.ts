import { db } from '@server/database/index.ts';
import { insertUserModel, updateUserModel, UsersTable } from '@server/database/schemas';
import type { createUserModelType, selectUserModelType, updateUserModelType } from '@server/types';
import { eq } from 'drizzle-orm';

export const getUsers = async () => {
	const dbResult = await db.select().from(UsersTable);
	return dbResult;
};

export const getUserById = async (id: number) => {
	const dbResult = await db.select().from(UsersTable).where(eq(UsersTable.user_id, id));
	return dbResult;
};

export const createUser = async (user: createUserModelType): Promise<selectUserModelType> => {
	const validatedUserBody = insertUserModel.parse(user);
	validatedUserBody.password = await Bun.password.hash(validatedUserBody.password);
	const result = await db
		.insert(UsersTable)
		.values(validatedUserBody)
		.returning()
		.then((res) => res[0]);
	return result;
};

export const updateUser = async (user: updateUserModelType, user_id: number) => {
	const validatedUserBody = updateUserModel.parse(user);
	// Hash the password if it exists
	if (validatedUserBody.password) validatedUserBody.password = await Bun.password.hash(validatedUserBody.password);

	// Filter out null or undefined values from the validatedUserBody
	const jsonUpdate = Object.fromEntries(Object.entries(validatedUserBody).filter(([_, value]) => value != null));
	const result = await db
		.update(UsersTable)
		.set({ ...jsonUpdate })
		.where(eq(UsersTable.user_id, user_id))
		.returning()
		.then((res) => res[0]);
	return result;
};

export const deleteUser = async (user_id: number) => {
	const result = await db
		.delete(UsersTable)
		.where(eq(UsersTable.user_id, user_id))
		.returning()
		.then((res) => res[0]);
	return result;
};

export const migrateUser = async (username: string, email: string, password: string) => {
	const createUser = insertUserModel.parse({ username, email, password });
	createUser.password = await Bun.password.hash(createUser.password);
	createUser.role = 'ADMIN';
	const result = await db
		.insert(UsersTable)
		.values(createUser)
		.returning()
		.then((res) => res[0]);
	return result;
};
