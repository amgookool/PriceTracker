import { relations } from "drizzle-orm";
import {
  PriceHistoriesTable,
  ProductsTable,
  SchedulesTable,
  UsersTable,
} from "./tables";

export const usersRelationships = relations(UsersTable, ({ many }) => ({
  schedules: many(SchedulesTable),
  products: many(ProductsTable),
}));

export const productsRelationships = relations(
  ProductsTable,
  ({ many, one }) => ({
    price_histories: many(PriceHistoriesTable),
    user: one(UsersTable, {
      fields: [ProductsTable.user_id],
      references: [UsersTable.user_id],
    }),
    schedule: one(SchedulesTable, {
      fields: [ProductsTable.schedule_id],
      references: [SchedulesTable.schedule_id],
    }),
  })
);

export const priceHistoriesRelationships = relations(
  PriceHistoriesTable,
  ({ one }) => ({
    product: one(ProductsTable, {
      fields: [PriceHistoriesTable.product_id],
      references: [ProductsTable.product_id],
    }),
  })
);

export const schedulesRelationships = relations(
  SchedulesTable,
  ({ one, many }) => ({
    user: one(UsersTable, {
      fields: [SchedulesTable.user_id],
      references: [UsersTable.user_id],
    }),
    product: one(ProductsTable, {
      fields: [SchedulesTable.product_id],
      references: [ProductsTable.product_id],
    }),
  })
);
