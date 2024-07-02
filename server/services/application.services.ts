import scheduler, { createJob, createTask } from '@scheduler/index';
import { scrapeAmazonProduct } from '@scraper/amazon.tracker';
import { scrapeNeweggProduct } from '@scraper/newegg.tracker';
import { db } from '@server/database/index.ts';
import { PriceHistoriesTable, ProductsTable, SchedulesTable } from '@server/database/schemas';
import type {
	createPriceHistoryModelType,
	createProductModelType,
	createScheduleModelType,
	clientAddProductModelType,
	clientUpdateProductModelType,
} from '@server/types';

import { createProductModel, createPriceHistoryModel, createScheduleModel, clientUpdateProductModel } from '@server/types';

import { and, desc, eq } from 'drizzle-orm';
import { formatDate, parseUpdateModelObject } from '@server/utils';

/**
 * Retrieves the favorite products of a user from the database.
 *
 * @param {number} userId - The ID of the user.
 * @return {Promise<Array<any>>} - A promise that resolves to an array of favorite products.
 */
export const getUsersFavoriteProducts = async (userId: number) => {
	const products = await db
		.select()
		.from(ProductsTable)
		.leftJoin(PriceHistoriesTable, eq(PriceHistoriesTable.product_id, ProductsTable.product_id))
		.leftJoin(SchedulesTable, eq(SchedulesTable.product_id, ProductsTable.product_id))
		.where(and(eq(ProductsTable.user_id, userId), eq(ProductsTable.is_favorite, true)))
		.orderBy(desc(ProductsTable.created_at));

	return products;
};

/**
 * Retrieves the favorite products of a user from the database.
 *
 * @param {number} userId - The ID of the user.
 * @return {Promise<Array<Object>>} A promise that resolves to an array of products.
 */
export const getUsersProducts = async (userId: number) => {
	const products = await db
		.select()
		.from(ProductsTable)
		.leftJoin(PriceHistoriesTable, eq(PriceHistoriesTable.product_id, ProductsTable.product_id))
		.leftJoin(SchedulesTable, eq(SchedulesTable.product_id, ProductsTable.product_id))
		.where(eq(ProductsTable.user_id, userId))
		.orderBy(desc(ProductsTable.created_at));

	return products;
};

/**
 * Adds a new product to the system. This will add entries to Products, Price Histories, and Schedules Tables.
 * The scrape operation will be performed once and the job will be created for the product and added to the scheduler.
 *
 * @param {addNewProductType} product - The product to be added.
 * @return {Promise<any>} A promise that resolves to the newly added product.
 */
export const addNewProduct = async (product: clientAddProductModelType) => {
	// Products Table Data Validation
	const productsTable_data = { ...product } as createProductModelType;
	const validatedProductData = createProductModel.parse(productsTable_data);

	// Scrape Operations
	let lastPrice: number;
	if (validatedProductData.website === 'AMAZON') {
		const scrapeResult = await scrapeAmazonProduct(validatedProductData.product_url);
		validatedProductData.image_url = scrapeResult.imageLink;
		validatedProductData.site_product_name = scrapeResult.productTitle;
		lastPrice = scrapeResult.price;
	} else {
		const scrapeResult = await scrapeNeweggProduct(validatedProductData.product_url);
		validatedProductData.image_url = scrapeResult.imageLink;
		validatedProductData.site_product_name = scrapeResult.productTitle;
		lastPrice = scrapeResult.price;
	}
	// Product Table Insertion
	const productInsertionId = await db
		.insert(ProductsTable)
		.values(validatedProductData)
		.returning()
		.then((res) => res[0].product_id);

	// Price History Table Insertion
	const priceHistory_data = {
		price: lastPrice,
		product_id: productInsertionId,
	} as createPriceHistoryModelType;
	const validatedPriceHistoryData = createPriceHistoryModel.parse(priceHistory_data);
	await db.insert(PriceHistoriesTable).values(validatedPriceHistoryData);

	// Schedule Table Insertion
	const jobName = generateJobName(product.name, productInsertionId);
	const scheduleTable_data = {
		user_id: product.user_id,
		scrape_interval: product.scrape_interval,
		job_name: jobName,
		product_id: productInsertionId,
		last_scraped_at: formatDate(new Date()),
	} as createScheduleModelType;
	const validatedScheduleData = createScheduleModel.parse(scheduleTable_data);

	const scheduleId = await db
		.insert(SchedulesTable)
		.values(validatedScheduleData)
		.returning()
		.then((res) => res[0].schedule_id);
	// Update Product Table with schedule_id
	await db.update(ProductsTable).set({ schedule_id: scheduleId }).where(eq(ProductsTable.product_id, productInsertionId));

	// create job
	const _task = async (taskId: string | undefined, jobId: string | undefined) => {
		console.log(`Task function ${taskId} triggered: JobID: ${jobId}`);
		await createScrapeJob({
			productId: productInsertionId,
			productUrl: validatedProductData.product_url,
			website: validatedProductData.website,
		});
	};
	const task = createTask(jobName, _task);
	const job = createJob(task, validatedScheduleData.scrape_interval ?? '1 days', scheduleId);

	scheduler.addSimpleIntervalJob(job);
	// return product
	return await db
		.select()
		.from(ProductsTable)
		.leftJoin(PriceHistoriesTable, eq(PriceHistoriesTable.product_id, ProductsTable.product_id))
		.leftJoin(SchedulesTable, eq(SchedulesTable.product_id, ProductsTable.product_id))
		.where(eq(ProductsTable.product_id, productInsertionId));
};

export const updateProduct = async (product: clientUpdateProductModelType, product_id: number) => {
	const validatedData = clientUpdateProductModel.parse(product);
	const updateData = parseUpdateModelObject(validatedData);
	if (updateData.scrape_interval) {
		console.log('yes scrape interval');
		console.log(updateData);
	} else {
		console.log('no scrape interval');
		console.log(updateData);
	}
};

/**
 * Asynchronously creates a scrape job based on the provided configuration.
 *
 * @param {Object} configs - An object containing the product ID, product URL, and website.
 * @param {number} configs.productId - The ID of the product to be scraped.
 * @param {string} configs.productUrl - The URL of the product to be scraped.
 * @param {string} configs.website - The website where the product is hosted.
 * @return {Promise<void>} A promise that resolves when the scrape job is complete.
 */
const createScrapeJob = async (configs: { productId: number; productUrl: string; website: string }) => {
	let scrapeResult: { productTitle: string; imageLink: string; price: number };
	if (configs.website === 'AMAZON') {
		scrapeResult = await scrapeAmazonProduct(configs.productUrl);
	} else {
		scrapeResult = await scrapeNeweggProduct(configs.productUrl);
	}
	const priceHistoryEntry = {
		price: scrapeResult.price,
		product_id: configs.productId,
	} as createPriceHistoryModelType;
	await db.insert(PriceHistoriesTable).values(priceHistoryEntry);
	const date = new Date();
	await db
		.update(SchedulesTable)
		.set({ last_scraped_at: formatDate(date) })
		.where(eq(SchedulesTable.product_id, configs.productId));
	return;
};

/**
 * Generates a job name based on the input name and id.
 *
 * @param {string} name - The name to be included in the job name.
 * @param {number} id - The id to be included in the job name.
 * @return {string} The generated job name.
 */
const generateJobName = (name: string, id: number) => {
	return id + '_' + name.toLowerCase().trim().split(' ').join('_');
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

// export const deleteSchedule = async (schedule_id: number) => {
// 	const result = await db
// 		.delete(SchedulesTable)
// 		.where(eq(SchedulesTable.schedule_id, schedule_id))
// 		.returning()
// 		.then((res) => res[0]);
// 	return result;
// };

// export const updateProduct = async (
// productUpdate: createUpdateProductModelType,
// 	productId: number,
// ): Promise<selectProductModelType> => {
// 	const validatedProduct = updateProductModel.parse(productUpdate);
// Filter out null or undefined values from the validatedUserBody
// 	const jsonUpdate = Object.fromEntries(Object.entries(validatedProduct).filter(([_, value]) => value != null));
// 	const result = await db
// 		.update(ProductsTable)
// 		.set({ ...jsonUpdate })
// 		.where(eq(ProductsTable.product_id, productId))
// 		.returning()
// 		.then((res) => res[0]);
// 	return result;
// };
