import {
	insertPriceHistorySchema,
	insertProductSchema,
	selectPriceHistorySchema,
	selectProductSchema,
	updateProductSchema,
} from '@server/database/schemas';

import { z } from 'zod';

export const createProductModel = insertProductSchema.omit({
	created_at: true,
	updated_at: true,
	schedule_id: true,
	product_id: true,
});

export const updateProductModel = updateProductSchema.omit({
	created_at: true,
	updated_at: true,
	product_id: true,
});

export const readProductModel = selectProductSchema;

export const createPriceHistoryModel = insertPriceHistorySchema.omit({
	created_at: true,
	price_history_id: true,
});

export const readPriceHistoryModel = selectPriceHistorySchema;

export type createProductModelType = z.infer<typeof createProductModel>;
export type updateProductModelType = z.infer<typeof updateProductModel>;
export type readProductModelType = z.infer<typeof readProductModel>;
export type createPriceHistoryModelType = z.infer<typeof createPriceHistoryModel>;
export type readPriceHistoryModelType = z.infer<typeof readPriceHistoryModel>;
