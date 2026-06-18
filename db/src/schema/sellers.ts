import { pgTable, text, serial, timestamp, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sellerProfilesTable = pgTable("seller_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  bio: text("bio"),
  story: text("story"),
  avatar: text("avatar"),
  location: text("location"),
  specialty: text("specialty"),
  isVerified: boolean("is_verified").notNull().default(false),
  hygieneCertified: boolean("hygiene_certified").notNull().default(false),
  followerCount: integer("follower_count").notNull().default(0),
  rating: doublePrecision("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sellerFollowsTable = pgTable("seller_follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSellerProfileSchema = createInsertSchema(sellerProfilesTable).omit({ id: true, createdAt: true });
export type InsertSellerProfile = z.infer<typeof insertSellerProfileSchema>;
export type SellerProfile = typeof sellerProfilesTable.$inferSelect;
