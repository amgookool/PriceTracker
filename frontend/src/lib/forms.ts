import { createProductModel } from '@server/types';
import { z } from 'zod';

const addNewProduct = createProductModel.extend({
	scrape_interval: z.string().trim(),
});

export type addNewProductType = z.infer<typeof addNewProduct>;
