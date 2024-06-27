import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Users table schema
export const UsersTable = sqliteTable('users', {
	user_id: integer('user_id').primaryKey({
		autoIncrement: true,
		onConflict: 'rollback',
	}),
	username: text('username', { mode: 'text', length: 255 }).unique().notNull(),
	email: text('email', { mode: 'text', length: 255 }).unique().notNull(),
	password: text('password', { mode: 'text', length: 255 }).notNull(),
	role: text('role', { mode: 'text', enum: ['USER', 'ADMIN'] })
		.default('USER')
		.notNull(),
	created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
	updated_at: text('updated_at')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});
// Products table schema
export const ProductsTable = sqliteTable('products', {
	product_id: integer('product_id').primaryKey({
		autoIncrement: true,
		onConflict: 'rollback',
	}),
	name: text('name', { mode: 'text', length: 255 }).notNull(),
	description: text('description', { mode: 'text', length: 255 }),
	is_favorite: integer('is_favorite', { mode: 'boolean' }).default(false),
	desired_price: real('desired_price').notNull(),
	product_url: text('product_url', { mode: 'text', length: 255 }).notNull(),
	site_product_name: text('site_product_name', { mode: 'text', length: 255 }),
	website: text('website', {
		mode: 'text',
		enum: ['AMAZON', 'NEWEGG'],
	}).notNull(),
	image_url: text('image_url', { mode: 'text', length: 255 }),
	user_id: integer('user_id')
		.notNull()
		.references(() => UsersTable.user_id),
	schedule_id: integer('schedule_id'),
	created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
	updated_at: text('updated_at')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});
// Product Price History table schema
export const PriceHistoriesTable = sqliteTable('price_histories', {
	price_history_id: integer('price_history_id').primaryKey({
		autoIncrement: true,
		onConflict: 'rollback',
	}),
	price: real('price').notNull(),
	created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
	product_id: integer('product_id')
		.notNull()
		.references(() => ProductsTable.product_id),
});
// Schedules table schema
export const SchedulesTable = sqliteTable('schedules', {
	schedule_id: integer('schedule_id').primaryKey({
		autoIncrement: true,
		onConflict: 'rollback',
	}),
	product_id: integer('product_id'),
	user_id: integer('user_id')
		.notNull()
		.references(() => UsersTable.user_id),
	last_scraped_at: text('last_scraped_at'),
	job_name: text('job_name', { mode: 'text' }),
	scrape_interval: text('scrape_interval', { mode: 'text', length: 255 }),
	created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
	updated_at: text('updated_at')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});
