import { gezWalkers } from './gez-prototype.ts';

export type MeetRequest = { walkerId: string; date: string; time: string };
export type WalkerConnections = { favorites: string[]; meetings: MeetRequest[] };
export const meetTimes = ['10:00', '12:00', '17:30', '18:30', '19:30'] as const;
const knownWalker = (id: unknown): id is string => typeof id === 'string' && gezWalkers.some(walker => walker.id === id);

export function bakuDate(now = new Date(), offsetDays = 0): string {
  return new Date(now.getTime() + 4 * 60 * 60 * 1000 + offsetDays * 86400000).toISOString().slice(0, 10);
}

export function toggleFavorite(favorites: readonly string[], walkerId: string): string[] {
  if (!knownWalker(walkerId)) return [...favorites];
  return favorites.includes(walkerId) ? favorites.filter(id => id !== walkerId) : [...favorites, walkerId];
}

export function createMeetRequest(walkerId: string, date: string, time: string, now = new Date()): MeetRequest | null {
  if (!knownWalker(walkerId) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !meetTimes.some(slot => slot === time)) return null;
  const calendarDate = new Date(`${date}T12:00:00Z`);
  if (!Number.isFinite(calendarDate.getTime()) || calendarDate.toISOString().slice(0, 10) !== date) return null;
  const start = new Date(`${date}T${time}:00+04:00`);
  if (start <= now || date > bakuDate(now, 30)) return null;
  return { walkerId, date, time };
}

export function upsertMeeting(meetings: readonly MeetRequest[], request: MeetRequest): MeetRequest[] {
  return [...meetings.filter(meeting => meeting.walkerId !== request.walkerId), request];
}

export function readConnections(raw: string | null, now = new Date()): WalkerConnections {
  const empty: WalkerConnections = { favorites: [], meetings: [] };
  try {
    const value: unknown = JSON.parse(raw ?? 'null');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return empty;
    const stored = value as Record<string, unknown>;
    const favorites = Array.isArray(stored.favorites) ? [...new Set(stored.favorites.filter(knownWalker))] : [];
    const meetings = (Array.isArray(stored.meetings) ? stored.meetings.slice(-30) : []).reduce<MeetRequest[]>((result, item) => {
      if (!item || typeof item !== 'object' || typeof item.walkerId !== 'string' || typeof item.date !== 'string' || typeof item.time !== 'string') return result;
      const request = createMeetRequest(item.walkerId, item.date, item.time, now);
      return request ? upsertMeeting(result, request) : result;
    }, []);
    return { favorites, meetings };
  } catch {
    return empty;
  }
}
