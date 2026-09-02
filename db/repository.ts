import { env } from 'cloudflare:workers';
import { and, desc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { bookings, dogs } from '@/db/schema';
import type { BookingInput, DogInput } from '@/lib/marketplace';

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) schemaReady = createSchema();
  return schemaReady;
}

async function createSchema(): Promise<void> {
  const d1 = env.DB;
  if (!d1) throw new Error('Database binding unavailable');

  await d1.batch([
    d1.prepare(`CREATE TABLE IF NOT EXISTS dogs (
      id TEXT PRIMARY KEY NOT NULL,
      owner_user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      breed TEXT NOT NULL,
      age_years INTEGER NOT NULL,
      size TEXT NOT NULL,
      energy TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL
    )`),
    d1.prepare(`CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY NOT NULL,
      owner_user_id TEXT NOT NULL,
      dog_id TEXT NOT NULL REFERENCES dogs(id),
      walker_id TEXT NOT NULL,
      district TEXT NOT NULL,
      duration INTEGER NOT NULL,
      scheduled_for INTEGER NOT NULL,
      status TEXT NOT NULL,
      price_manat INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    )`),
    d1.prepare('CREATE INDEX IF NOT EXISTS idx_dogs_owner_user_id ON dogs (owner_user_id)'),
    d1.prepare('CREATE INDEX IF NOT EXISTS idx_bookings_owner_user_id ON bookings (owner_user_id)'),
    d1.prepare('CREATE INDEX IF NOT EXISTS idx_bookings_owner_status ON bookings (owner_user_id, status)'),
    d1.prepare('PRAGMA optimize'),
  ]);
}

export async function listDogs(ownerUserId: string) {
  await ensureSchema();
  return getDb().select().from(dogs).where(eq(dogs.ownerUserId, ownerUserId)).orderBy(desc(dogs.createdAt));
}

export async function listBookings(ownerUserId: string) {
  await ensureSchema();
  return getDb().select().from(bookings).where(eq(bookings.ownerUserId, ownerUserId)).orderBy(desc(bookings.scheduledFor)).limit(8);
}

export async function createDog(ownerUserId: string, input: DogInput) {
  await ensureSchema();
  const dog = {
    id: `dog_${crypto.randomUUID()}`,
    ownerUserId,
    ...input,
    createdAt: new Date(),
  };
  await getDb().insert(dogs).values(dog);
  return dog;
}

export async function createBooking(ownerUserId: string, input: BookingInput, priceManat: number) {
  await ensureSchema();
  const ownedDog = await getDb()
    .select({ id: dogs.id })
    .from(dogs)
    .where(and(eq(dogs.id, input.dogId), eq(dogs.ownerUserId, ownerUserId)))
    .limit(1);

  if (!ownedDog[0]) throw new Error('Dog not found');

  const booking = {
    id: `walk_${crypto.randomUUID()}`,
    ownerUserId,
    dogId: input.dogId,
    walkerId: input.walkerId,
    district: input.district,
    duration: input.duration,
    scheduledFor: new Date(input.scheduledFor),
    status: 'requested' as const,
    priceManat,
    createdAt: new Date(),
  };
  await getDb().insert(bookings).values(booking);
  return booking;
}
