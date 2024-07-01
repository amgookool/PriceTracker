import { insertScheduleModel, selectScheduleModel, updateScheduleModel } from '@server/database/schemas';
import { z } from 'zod';

const createScheduleModel = insertScheduleModel.omit({
	created_at: true,
	updated_at: true,
	schedule_id: true,
});

export { createScheduleModel, updateScheduleModel };
export type selectScheduleModelType = z.infer<typeof selectScheduleModel>;
export type updateScheduleModelType = z.infer<typeof updateScheduleModel>;
export type createScheduleModelType = z.infer<typeof createScheduleModel>;
