import { z } from 'zod';

export const bakuDistricts = ['Yasamal', 'Nərimanov', 'Nəsimi', 'Səbail'] as const;
export const dogSizes = ['small', 'medium', 'large'] as const;
export const dogEnergyLevels = ['calm', 'medium', 'high'] as const;
export const walkDurations = [30, 45, 60] as const;

const optionalText = z.string().trim().max(240).optional().default('');

const dogInputSchema = z.object({
  name: z.string().trim().min(1).max(40),
  breed: z.string().trim().max(60).optional().default('Qarışıq'),
  ageYears: z.coerce.number().int().min(0).max(30),
  size: z.enum(dogSizes).optional().default('medium'),
  energy: z.enum(dogEnergyLevels).optional().default('medium'),
  notes: optionalText,
});

const bookingInputSchema = z.object({
  dogId: z.string().trim().min(8).max(80),
  walkerId: z.string().trim().min(2).max(80),
  district: z.enum(bakuDistricts),
  duration: z.coerce.number().pipe(z.union([
    z.literal(30),
    z.literal(45),
    z.literal(60),
  ])),
  scheduledFor: z.string().trim().refine((value) => Number.isFinite(Date.parse(value)), 'Invalid schedule'),
});

export type DogInput = z.infer<typeof dogInputSchema>;
export type BookingInput = z.infer<typeof bookingInputSchema>;
export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

export type Walker = {
  id: string;
  name: string;
  district: (typeof bakuDistricts)[number];
  rating: number;
  walks: number;
  largeDogs: boolean;
  nextAvailableMinutes: number;
  price30: number;
};

export function parseDogInput(input: unknown): ValidationResult<DogInput> {
  const result = dogInputSchema.safeParse(input);
  if (!result.success) {
    return { ok: false, message: 'İt məlumatlarını yoxlayın və yenidən cəhd edin.' };
  }

  return { ok: true, value: result.data };
}

export function parseBookingInput(input: unknown): ValidationResult<BookingInput> {
  const result = bookingInputSchema.safeParse(input);
  if (!result.success) {
    return { ok: false, message: 'Gəzinti məlumatları düzgün deyil.' };
  }

  return { ok: true, value: result.data };
}

export function matchWalkers(
  walkers: readonly Walker[],
  criteria: { district: Walker['district']; dogSize: (typeof dogSizes)[number] },
): Walker[] {
  return walkers
    .filter((walker) => walker.district === criteria.district)
    .filter((walker) => criteria.dogSize !== 'large' || walker.largeDogs)
    .toSorted((left, right) =>
      left.nextAvailableMinutes - right.nextAvailableMinutes || right.rating - left.rating,
    );
}

export function priceForWalk(price30: number, duration: number): number {
  if (duration === 45) return Math.round(price30 * 1.4);
  if (duration === 60) return Math.round(price30 * 1.8);
  return price30;
}
