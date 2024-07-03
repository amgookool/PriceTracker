import { db } from '@server/database/index.ts';
import { UsersTable } from '@server/database/schemas';
import {
	createUserModel,
	readUserModel,
	updateUserModel,
	type createUserModelType,
	type readUserModelType,
	type updateUserModelType,
} from '@server/types';
import { parseUpdateModelObject } from '@server/utils';
import { eq } from 'drizzle-orm';

export const getUsers = async (): Promise<readUserModelType[]> => {
	const dbResult = await db
		.select()
		.from(UsersTable)
		.then((res) => res.map((user) => readUserModel.parse(user)));
	return dbResult;
};

export const getUserById = async (id: number): Promise<readUserModelType | null> => {
	const dbResult = await db
		.select()
		.from(UsersTable)
		.where(eq(UsersTable.user_id, id))
		.then((res) => res[0])
		.catch((e) => {
			console.error(e);
			return null;
		});
	return dbResult;
};

export const createUser = async (user: createUserModelType): Promise<readUserModelType> => {
	const validatedUserBody = createUserModel.parse(user);
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
	const jsonUpdate = parseUpdateModelObject(validatedUserBody);
	const result = await db
		.update(UsersTable)
		.set({ ...jsonUpdate })
		.where(eq(UsersTable.user_id, user_id))
		.returning()
		.then((res) => res[0]);
	return result;
};

export const deleteUser = async (user_id: number): Promise<number> => {
	const userDeleteResultId = await db
		.delete(UsersTable)
		.where(eq(UsersTable.user_id, user_id))
		.returning()
		.then((res) => res[0].user_id);
	return userDeleteResultId;
};

export const migrateUser = async (username: string, email: string, password: string) => {
	const createUser = createUserModel.parse({ username, email, password });
	createUser.password = await Bun.password.hash(createUser.password);
	createUser.role = 'ADMIN';
	const result = await db
		.insert(UsersTable)
		.values(createUser)
		.returning()
		.then((res) => res[0]);
	return result;
};
