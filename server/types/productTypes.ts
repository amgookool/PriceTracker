import { insertPriceHistoryModel, insertProductModel, selectProductModel, updateProductModel } from '@server/database/schemas';
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

export const createProductModel = insertProductModel.omit({
	created_at: true,
	updated_at: true,
	image_url: true,
	schedule_id: true,
	product_id: true,
	site_product_name: true,
});

export const createUpdateProductModel = updateProductModel.omit({
	created_at: true,
	updated_at: true,
	product_id: true,
});

export const createPriceHistoryModel = insertPriceHistoryModel.omit({
	created_at: true,
	price_history_id: true,
});

export type createProductModelType = z.infer<typeof createProductModel>;
export type createUpdateProductModelType = z.infer<typeof createUpdateProductModel>;
export type selectProductModelType = z.infer<typeof selectProductModel>;
export type createPriceHistoryModelType = z.infer<typeof createPriceHistoryModel>;
