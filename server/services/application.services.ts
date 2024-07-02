import { scrapeAmazonProduct } from '@scraper/amazon.tracker';
import { scrapeNeweggProduct } from '@scraper/newegg.tracker';
import { db } from '@server/database/index.ts';
import {
	ProductsTable,
	SchedulesTable,
	PriceHistoriesTable,
	insertProductModel,
	insertScheduleModel,
	insertPriceHistoryModel,
} from '@server/database/schemas';
import type {
	createProductModelType,
	createScheduleModelType,
	addNewProductType,
	createPriceHistoryModelType,
} from '@server/types';
import { asc, desc, eq, and } from 'drizzle-orm';
import { createTask, createJob, scheduler } from '@scheduler/scheduler';
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

export const addNewProduct = async (product: addNewProductType) => {
	const productsTable_data = { ...product } as createProductModelType;

	const validatedProductData = insertProductModel.parse(productsTable_data);
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

	const productInsertionId = await db
		.insert(ProductsTable)
		.values(validatedProductData)
		.returning()
		.then((res) => res[0].product_id);

	const priceHistory_data = {
		price: lastPrice,
		product_id: productInsertionId,
	} as createPriceHistoryModelType;

	const jobName = generateJobName(product.name, productInsertionId);
	const scheduleTable_data = {
		user_id: product.user_id,
		scrape_interval: product.scrape_interval,
		job_name: jobName,
		product_id: productInsertionId,
	} as createScheduleModelType;

	const validatedScheduleData = insertScheduleModel.parse(scheduleTable_data);
	const validatedPriceHistoryData = insertPriceHistoryModel.parse(priceHistory_data);

	const scheduleId = await db
		.insert(SchedulesTable)
		.values(validatedScheduleData)
		.returning()
		.then((res) => res[0].schedule_id);

	await db.insert(PriceHistoriesTable).values(validatedPriceHistoryData);

	await db.update(ProductsTable).set({ schedule_id: scheduleId }).where(eq(ProductsTable.product_id, productInsertionId));

	// create job
	const _task = createScrapeJob({
		productId: productInsertionId,
		productUrl: validatedProductData.product_url,
		website: validatedProductData.website,
	});
	const taskFunction = async (taskId = jobName, jobId = `${scheduleId}`) => {
		console.log('Task triggered: ', taskId, jobId);
		return _task;
	};
	const task = createTask(jobName, taskFunction);
	const job = createJob(task, validatedScheduleData.scrape_interval ?? '2 minutes', scheduleId);

	scheduler.addSimpleIntervalJob(job);

	return await db
		.select()
		.from(ProductsTable)
		.leftJoin(PriceHistoriesTable, eq(PriceHistoriesTable.product_id, ProductsTable.product_id))
		.leftJoin(SchedulesTable, eq(SchedulesTable.product_id, ProductsTable.product_id))
		.where(eq(ProductsTable.product_id, productInsertionId));
};

export const createScrapeJob = async (configs: { productId: number; productUrl: string; website: string }) => {
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
	return;
};

const generateJobName = (name: string, id: number) => {
	return id + '_' + name.toLowerCase().trim().split(' ').join('_');
};
