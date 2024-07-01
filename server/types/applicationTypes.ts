import {
	insertPriceHistoryModel,
	insertProductModel,
	selectProductModel,
	updateProductModel,
	insertScheduleModel,
	selectScheduleModel,
	updateScheduleModel,
	selectPriceHistoryModel,
} from '@server/database/schemas';

import { z } from 'zod';

export const createScheduleModel = insertScheduleModel.omit({
	created_at: true,
	updated_at: true,
	schedule_id: true,
});
export const createUpdateScheduleModel = updateScheduleModel.omit({
	created_at: true,
	updated_at: true,
	schedule_id: true,
});

export const addProductModel = insertProductModel
	.omit({
		created_at: true,
		updated_at: true,
		image_url: true,
		schedule_id: true,
		product_id: true,
		site_product_name: true,
	})
	.extend({
		scrape_interval: z.string().trim(),
	});

export const _updateProductModel = insertProductModel
	.omit({
		created_at: true,
		updated_at: true,
		product_id: true,
	})
	.extend({
		scrape_interval: z.string().trim().nullable().optional(),
	});

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

export const selectProductModelWithPriceHistory = selectProductModel.extend({
	price_histories: selectPriceHistoryModel.array(),
});

export const selectProductModelWithSchedule = selectProductModelWithPriceHistory.extend({
	schedules: selectScheduleModel.array(),
});

export const selectProductModelWithPriceHistoryAndSchedule = selectProductModelWithPriceHistory.extend({
	schedules: selectScheduleModel.array(),
});
export type addNewProductType = z.infer<typeof addProductModel>;
export type updateProductType = z.infer<typeof _updateProductModel>;
export type createProductModelType = z.infer<typeof createProductModel>;
export type updateProductModelType = z.infer<typeof createUpdateProductModel>;
export type selectProductModelType = z.infer<typeof selectProductModelWithPriceHistory>;
export type selectProductModelWithPriceHistoryType = z.infer<typeof selectProductModelWithPriceHistory>;
export type selectProductModelWithScheduleType = z.infer<typeof selectProductModelWithSchedule>;
export type selectProductModelWithPriceHistoryAndScheduleType = z.infer<typeof selectProductModelWithPriceHistoryAndSchedule>;
export type selectPriceHistoryModelType = z.infer<typeof selectPriceHistoryModel>;

export type createScheduleModelType = z.infer<typeof createScheduleModel>;
export type createUpdateScheduleModelType = z.infer<typeof createUpdateScheduleModel>;
export type createPriceHistoryModelType = z.infer<typeof createPriceHistoryModel>;
