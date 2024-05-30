import { insertProductModel, selectProductModel, updateProductModel, insertPriceHistoryModel } from "@server/database/schemas";
import { z } from "zod";

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
  product_id: true
});

export const createPriceHistoryModel = insertPriceHistoryModel.omit({
  created_at: true,
  price_history_id: true,
});

export type createProductModelType = z.infer<typeof createProductModel>;
export type createUpdateProductModelType = z.infer<typeof createUpdateProductModel>;
export type selectProductModelType = z.infer<typeof selectProductModel>;
export type createPriceHistoryModelType = z.infer<typeof createPriceHistoryModel>;