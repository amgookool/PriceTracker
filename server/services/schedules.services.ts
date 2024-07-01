import { db } from '@server/database/index.ts';
import { ProductsTable, SchedulesTable, insertScheduleModel, updateScheduleModel } from '@server/database/schemas';
import type { createScheduleModelType } from '@server/types';
import { eq } from 'drizzle-orm';

export const getSchedulesByUserId = async (id: number) => {
	const dbResult = await db.select().from(SchedulesTable).where(eq(SchedulesTable.user_id, id));
	return dbResult;
};

export const getAllSchedules = async () => {
	const dbResult = await db.select().from(SchedulesTable);
	return dbResult;
};

export const createSchedule = async (schedule: createScheduleModelType) => {
	const validatedSchedule = insertScheduleModel.parse(schedule);
	const result = await db
		.insert(SchedulesTable)
		.values(validatedSchedule)
		.returning()
		.then((res) => res[0]);
	await db
		.update(ProductsTable)
		.set({ schedule_id: result.schedule_id })
		.where(eq(ProductsTable.product_id, SchedulesTable.product_id));
	return result;
};

// export const updateSchedule = async (schedule: updateScheduleModelType, schedule_id: number) => {
// 	const validatedUserBody = updateScheduleModel.parse(schedule);
// 	const jsonUpdate = Object.fromEntries(Object.entries(validatedUserBody).filter(([_, value]) => value != null));
// 	const result = await db
// 		.update(SchedulesTable)
// 		.set({ ...jsonUpdate })
// 		.where(eq(SchedulesTable.schedule_id, schedule_id))
// 		.returning()
// 		.then((res) => res[0]);
// 	return result;
// };

export const deleteSchedule = async (schedule_id: number) => {
	const result = await db
		.delete(SchedulesTable)
		.where(eq(SchedulesTable.schedule_id, schedule_id))
		.returning()
		.then((res) => res[0]);
	return result;
};
