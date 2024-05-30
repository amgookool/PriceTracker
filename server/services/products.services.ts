import { db } from "@server/database/index.ts";
import {
  PriceHistoriesTable,
  ProductsTable,
  insertPriceHistoryModel,
  insertProductModel,
  updateProductModel,
} from "@server/database/schemas";
import { asc, desc, eq } from "drizzle-orm";
import { scrapeAmazonProduct } from "@scraper/amazon.tracker";
import type {
  createPriceHistoryModelType,
  createProductModelType,
  createUpdateProductModelType,
  selectProductModelType,
} from "@Types/index";

export const getProducts = async (): Promise<selectProductModelType[]> => {
  const products = await db
    .select()
    .from(ProductsTable)
    .orderBy(desc(ProductsTable.created_at));
  return products;
};

export const getProductsWithPriceHistory = async () => {
  const products = await await db
    .select()
    .from(ProductsTable)
    .orderBy(asc(ProductsTable.created_at));

  const result = await Promise.all(
    products.map(async (product) => {
      const histories = await db
        .select()
        .from(PriceHistoriesTable)
        .orderBy(desc(PriceHistoriesTable.created_at))
        .where(eq(PriceHistoriesTable.product_id, product.product_id));
      return {
        ...product,
        price_histories: histories,
      };
    })
  );
  return result;
};

export const getProductsByUserId = async (
  userId: number
): Promise<selectProductModelType[]> => {
  const products = await db
    .select()
    .from(ProductsTable)
    .where(eq(ProductsTable.user_id, userId))
    .orderBy(desc(ProductsTable.created_at));
  return products;
};

export const getProductByProductId = async (productId: number) => {
  const product = await db
    .select()
    .from(ProductsTable)
    .where(eq(ProductsTable.product_id, productId))
    .then((res) => res[0]);

  const histories = await db
    .select()
    .from(PriceHistoriesTable)
    .where(eq(PriceHistoriesTable.product_id, productId));

  return {
    ...product,
    price_histories: histories,
  };
};

export const addProduct = async (
  newProduct: createProductModelType
): Promise<selectProductModelType> => {
  const validatedProduct = insertProductModel.parse(newProduct);
  const scrapeResult = await scrapeAmazonProduct(validatedProduct.product_url);
  validatedProduct.image_url = scrapeResult.imageLink;
  validatedProduct.site_product_name = scrapeResult.productTitle;
  const result = await db
    .insert(ProductsTable)
    .values(validatedProduct)
    .returning()
    .then((res) => res[0]);
  await addPriceHistory({
    price: scrapeResult.price,
    product_id: result.product_id,
  });
  return result;
};

export const updateProduct = async (
  productUpdate: createUpdateProductModelType,
  productId: number
): Promise<selectProductModelType> => {
  const validatedProduct = updateProductModel.parse(productUpdate);
  // Filter out null or undefined values from the validatedUserBody
  const jsonUpdate = Object.fromEntries(
    Object.entries(validatedProduct).filter(([_, value]) => value != null)
  );
  const result = await db
    .update(ProductsTable)
    .set({ ...jsonUpdate })
    .where(eq(ProductsTable.product_id, productId))
    .returning()
    .then((res) => res[0]);
  return result;
};

export const deleteProduct = async (productId: number) => {
  const result = await db
    .delete(ProductsTable)
    .where(eq(ProductsTable.product_id, productId))
    .returning()
    .then((res) => res[0]);
  return result;
};

export const addPriceHistory = async (
  price_hisory: createPriceHistoryModelType
) => {
  const validatedPriceHistory = insertPriceHistoryModel.parse(price_hisory);
  const result = await db
    .insert(PriceHistoriesTable)
    .values(validatedPriceHistory)
    .returning()
    .then((res) => res[0]);
  return result;
};
