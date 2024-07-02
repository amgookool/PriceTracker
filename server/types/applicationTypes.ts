import {
	insertProductSchema,
	// insertScheduleSchema,
	// insertPriceHistorySchema,
	// selectProductSchema,
	// selectScheduleSchema,
	// selectPriceHistorySchema,
	// updateScheduleSchema,
	updateProductSchema,
} from '@server/database/schemas';

import { z } from 'zod';

export const clientAddProductModel = insertProductSchema
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

export type clientAddProductModelType = z.infer<typeof clientAddProductModel>;

export const clientUpdateProductModel = updateProductSchema
	.omit({
		created_at: true,
		updated_at: true,
	})
	.extend({
		scrape_interval: z.string().trim().nullable().optional(),
	});

export type clientUpdateProductModelType = z.infer<typeof clientUpdateProductModel>;
