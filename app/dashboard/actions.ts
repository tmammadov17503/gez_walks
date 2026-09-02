'use server';

import { revalidatePath } from 'next/cache';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { createBooking, createDog } from '@/db/repository';
import { parseBookingInput, parseDogInput, priceForWalk } from '@/lib/marketplace';
import { getWalker } from '@/lib/walkers';

export type ActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

export const initialActionState: ActionState = { status: 'idle', message: '' };

export async function addDogAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getChatGPTUser();
  if (!user) return { status: 'error', message: 'Davam etmək üçün daxil olun.' };

  const parsed = parseDogInput({
    name: formData.get('name'),
    breed: formData.get('breed'),
    ageYears: formData.get('ageYears'),
    size: formData.get('size'),
    energy: formData.get('energy'),
    notes: formData.get('notes'),
  });
  if (!parsed.ok) return { status: 'error', message: parsed.message };

  try {
    await createDog(user.userId, parsed.value);
    revalidatePath('/dashboard');
    return { status: 'success', message: `${parsed.value.name} profilinizə əlavə edildi.` };
  } catch {
    return { status: 'error', message: 'İti əlavə etmək mümkün olmadı. Yenidən cəhd edin.' };
  }
}

export async function bookWalkAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getChatGPTUser();
  if (!user) return { status: 'error', message: 'Davam etmək üçün daxil olun.' };

  const parsed = parseBookingInput({
    dogId: formData.get('dogId'),
    walkerId: formData.get('walkerId'),
    district: formData.get('district'),
    duration: formData.get('duration'),
    scheduledFor: formData.get('scheduledFor'),
  });
  if (!parsed.ok) return { status: 'error', message: parsed.message };

  const walker = getWalker(parsed.value.walkerId);
  if (!walker || walker.district !== parsed.value.district) {
    return { status: 'error', message: 'Bu gəzdirici artıq uyğun deyil. Siyahını yeniləyin.' };
  }

  try {
    await createBooking(
      user.userId,
      parsed.value,
      priceForWalk(walker.price30, parsed.value.duration),
    );
    revalidatePath('/dashboard');
    return { status: 'success', message: `${walker.name} üçün sorğu göndərildi.` };
  } catch {
    return { status: 'error', message: 'Gəzinti sifarişi yaradılmadı. İt profilini yoxlayın.' };
  }
}
