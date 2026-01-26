import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Import Auth Models
export * from "./models/auth";
import { users } from "./models/auth";

// === TABLE DEFINITIONS ===

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  stock: integer("stock").notNull().default(0),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(), // FK handled in application logic or explicit FK
  userId: varchar("user_id").notNull(), // FK to auth users
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // FK to auth users
  productId: integer("product_id").notNull(), // FK to products
  quantity: integer("quantity").notNull().default(1),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(), // FK to auth users
  balance: integer("balance").notNull().default(0), // in cents
});

// === RELATIONS ===
export const productsRelations = relations(products, ({ many }) => ({
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
}));


// === SCHEMAS ===

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true });
export const insertWalletSchema = createInsertSchema(wallets).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Wallet = typeof wallets.$inferSelect;

// Request Types
export type CreateReviewRequest = Omit<InsertReview, "userId" | "productId"> & { productId: number }; // User ID from session
export type AddToCartRequest = { productId: number; quantity: number };
export type UpdateCartItemRequest = { quantity: number };
export type DepositRequest = { amount: number }; // in cents

// Response Types
export type ProductResponse = Product;
export type ReviewWithUser = Review & { user: { username: string; profileImageUrl: string | null } }; // Simplified user info
export type CartItemWithProduct = CartItem & { product: Product };
export type WalletResponse = Wallet;
