import { insertScheduleSchema, selectScheduleSchema, updateScheduleSchema } from '@server/database/schemas';
import { z } from 'zod';

export const createScheduleModel = insertScheduleSchema.omit({
	created_at: true,
	updated_at: true,
	schedule_id: true,
});
export const updateScheduleModel = updateScheduleSchema.omit({
	created_at: true,
	updated_at: true,
	schedule_id: true,
});

export const readScheduleModel = selectScheduleSchema;

export type createScheduleModelType = z.infer<typeof createScheduleModel>;
export type updateScheduleModelType = z.infer<typeof updateScheduleModel>;
export type readScheduleModelType = z.infer<typeof readScheduleModel>;
