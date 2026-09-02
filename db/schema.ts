import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const dogs = sqliteTable(
  'dogs',
  {
    id: text('id').primaryKey(),
    ownerUserId: text('owner_user_id').notNull(),
    name: text('name').notNull(),
    breed: text('breed').notNull(),
    ageYears: integer('age_years').notNull(),
    size: text('size', { enum: ['small', 'medium', 'large'] }).notNull(),
    energy: text('energy', { enum: ['calm', 'medium', 'high'] }).notNull(),
    notes: text('notes').notNull().default(''),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [index('idx_dogs_owner_user_id').on(table.ownerUserId)],
);

export const bookings = sqliteTable(
  'bookings',
  {
    id: text('id').primaryKey(),
    ownerUserId: text('owner_user_id').notNull(),
    dogId: text('dog_id').notNull().references(() => dogs.id),
    walkerId: text('walker_id').notNull(),
    district: text('district').notNull(),
    duration: integer('duration').notNull(),
    scheduledFor: integer('scheduled_for', { mode: 'timestamp' }).notNull(),
    status: text('status', { enum: ['requested', 'confirmed', 'completed', 'cancelled'] }).notNull(),
    priceManat: integer('price_manat').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    index('idx_bookings_owner_user_id').on(table.ownerUserId),
    index('idx_bookings_owner_status').on(table.ownerUserId, table.status),
  ],
);

export type Dog = typeof dogs.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
