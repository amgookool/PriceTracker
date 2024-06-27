import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { PriceHistoriesTable, ProductsTable, SchedulesTable, UsersTable } from './tables';

// Model for inserting a new user
export const insertUserModel = createInsertSchema(UsersTable, {
	username: z
		.string({
			required_error: 'Username is required',
			invalid_type_error: 'Username must be a string',
		})
		.min(3, { message: 'Username must be at least 3 characters long' })
		.max(255, { message: 'Username must be at most 255 characters long' })
		.trim(),
	email: z
		.string({
			required_error: 'Email is required',
			invalid_type_error: 'Email must be a string',
		})
		.email(),
	password: z.string().min(8, { message: 'Password must be at least 8 characters long' }).trim(),
});
// Model for selecting a user
export const selectUserModel = createSelectSchema(UsersTable);
// Model for updating a user
export const updateUserModel = createInsertSchema(UsersTable, {
	user_id: z.number().int().positive(),
	username: z.string().optional().nullable(),
	email: z.string().optional().nullable(),
	password: z.string().optional().nullable(),
	role: z.string().optional().nullable(),
});

// Model for inserting a new Product
export const insertProductModel = createInsertSchema(ProductsTable, {
	name: z
		.string({
			required_error: 'Name is required',
			invalid_type_error: 'Name must be a string',
		})
		.min(3, { message: 'Name must be at least 3 characters' })
		.trim(),
	is_favorite: z.boolean().default(false),
	description: z.string({ invalid_type_error: 'Description must be a string' }).trim().nullable(),
	desired_price: z
		.number({
			required_error: 'The desired price is required',
			invalid_type_error: 'The desired price must be a number',
		})
		.nonnegative({ message: 'The desired price must be a positive value' })
		.finite({ message: 'The desired price must be a finite number' }),
	product_url: z.string({ required_error: 'The product URL is required' }).url({ message: 'A valid URl must be used' }).trim(),
	site_product_name: z.string().trim().nullable(),
	website: z.enum(['AMAZON', 'NEWEGG']),
	image_url: z.string().url().trim().nullable(),
	user_id: z.number({ required_error: 'The user ID is required' }).int().positive(),
	schedule_id: z.number().int().positive().nullable(),
});
// Model for updating a product
export const updateProductModel = createInsertSchema(ProductsTable, {
	name: z.string().min(3, { message: 'Name must be at least 3 characters' }).trim().optional().nullable(),
	description: z.string().trim().optional().nullable(),
	is_favorite: z.boolean().optional().nullable(),
	desired_price: z.number().nonnegative().finite().optional().nullable(),
	product_url: z.string().url().nullable().optional(),
	site_product_name: z.string().trim().nullable().optional(),
	website: z.enum(['AMAZON', 'NEWEGG']).nullable().optional(),
	image_url: z.string().url().trim().optional().nullable(),
	user_id: z.number().int().positive().nullable().optional(),
	schedule_id: z.number().int().positive().nullable().optional(),
});
// Model for selecting a product
export const selectProductModel = createSelectSchema(ProductsTable);

// Model for inserting a new schedule
export const insertScheduleModel = createInsertSchema(SchedulesTable, {
	product_id: z.number({ required_error: 'The product ID is required' }).int().positive(),
	user_id: z.number({ message: 'The user ID is required' }).int().positive(),
	last_scraped_at: z.string().optional().nullable(),
	scrape_interval: z.string({ message: 'The scrape interval is required' }).trim(),
	job_name: z.string().trim().optional().nullable(),
});
// Model for selecting a new schedule
export const selectScheduleModel = createSelectSchema(SchedulesTable);
// Model for updating a schedule
export const updateScheduleModel = createInsertSchema(SchedulesTable, {
	last_scraped_at: z.date().optional().nullable(),
	scrape_interval: z.string().trim().optional().nullable(),
	user_id: z.number().int().positive().optional().nullable(),
	product_id: z.number().int().positive().optional().nullable(),
	job_name: z.string().trim().optional().nullable(),
});

// Model for inserting a new price history
export const insertPriceHistoryModel = createInsertSchema(PriceHistoriesTable, {
	product_id: z
		.number({
			required_error: 'Product ID is required',
			invalid_type_error: 'Product ID must be a number',
		})
		.int({ message: 'Product ID must be an integer' })
		.positive({ message: 'Product ID must be positive' }),
	price: z
		.number({
			required_error: 'Price is required',
			invalid_type_error: 'Price must be a number',
		})
		.nonnegative({ message: 'Price must be non-negative' })
		.finite({ message: 'Price must be finite' }),
});
// Model for selecting a price history
export const selectPriceHistoryModel = createSelectSchema(PriceHistoriesTable);
