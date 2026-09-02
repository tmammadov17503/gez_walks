import type { Walker } from '@/lib/marketplace';

export const walkers: readonly Walker[] = [
  { id: 'aysel', name: 'Aysel G.', district: 'Yasamal', rating: 4.97, walks: 126, largeDogs: true, nextAvailableMinutes: 35, price30: 12 },
  { id: 'murad', name: 'Murad A.', district: 'Yasamal', rating: 4.92, walks: 88, largeDogs: false, nextAvailableMinutes: 15, price30: 10 },
  { id: 'nigar', name: 'Nigar M.', district: 'Nərimanov', rating: 4.99, walks: 74, largeDogs: true, nextAvailableMinutes: 20, price30: 14 },
  { id: 'elvin', name: 'Elvin H.', district: 'Nəsimi', rating: 4.95, walks: 152, largeDogs: true, nextAvailableMinutes: 40, price30: 13 },
  { id: 'gunel', name: 'Günel R.', district: 'Səbail', rating: 4.98, walks: 109, largeDogs: false, nextAvailableMinutes: 25, price30: 15 },
];

export function getWalker(walkerId: string) {
  return walkers.find((walker) => walker.id === walkerId) ?? null;
}
