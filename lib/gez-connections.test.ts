import assert from 'node:assert/strict';
import test from 'node:test';
import { bakuDate, createMeetRequest, readConnections, toggleFavorite, upsertMeeting } from './gez-connections.ts';

const now = new Date('2026-09-03T12:00:00Z');

void test('favorites are reversible, unique, and restricted to known walkers', () => {
  const original = ['nigar'];
  assert.deepEqual(toggleFavorite(original, 'murad'), ['nigar', 'murad']);
  assert.deepEqual(toggleFavorite(original, 'nigar'), []);
  assert.deepEqual(toggleFavorite(original, 'unknown'), original);
  assert.deepEqual(original, ['nigar']);
});

void test('stored preferences are allowlisted and malformed data resets safely', () => {
  for (const raw of [null, '', '{broken', 'null', '[]', '42']) {
    assert.deepEqual(readConnections(raw, now), { favorites: [], meetings: [] });
  }
  const result = readConnections(JSON.stringify({ favorites: ['nigar', 'nigar', 'unknown', 4, 'murad'], meetings: 'bad', emergency: 'private' }), now);
  assert.deepEqual(result, { favorites: ['nigar', 'murad'], meetings: [] });
});

void test('meet requests use Baku time, valid calendar dates, and a 30-day window', () => {
  assert.equal(bakuDate(new Date('2026-09-03T21:00:00Z')), '2026-09-04');
  assert.equal(bakuDate(now, 1), '2026-09-04');
  assert.deepEqual(createMeetRequest('nigar', '2026-09-04', '17:30', now), { walkerId: 'nigar', date: '2026-09-04', time: '17:30' });
  for (const args of [
    ['unknown', '2026-09-04', '17:30'], ['nigar', '2026-09-02', '17:30'],
    ['nigar', '2026-09-03', '10:00'], ['nigar', '2026-09-04', '25:00'],
    ['nigar', '2026-09-31', '17:30'], ['nigar', '2027-01-01', '17:30'],
    ['nigar', 'not-a-date', '17:30'], ['nigar', '2026-09-04', '17:31'],
  ]) assert.equal(createMeetRequest(...args as [string, string, string], now), null);
});

void test('one upcoming meeting per walker can be rescheduled without mutation', () => {
  const first = createMeetRequest('nigar', '2026-09-04', '17:30', now)!;
  const next = createMeetRequest('nigar', '2026-09-05', '18:30', now)!;
  const other = createMeetRequest('murad', '2026-09-05', '12:00', now)!;
  const meetings = [first, other];
  assert.deepEqual(upsertMeeting(meetings, next), [other, next]);
  assert.deepEqual(meetings, [first, other]);
});

void test('restored meetings exclude expired, unknown, duplicate, and extra fields', () => {
  const raw = JSON.stringify({ favorites: false, meetings: [
    { walkerId: 'nigar', date: '2026-09-04', time: '17:30', privateNote: 'omit' },
    { walkerId: 'nigar', date: '2026-09-05', time: '18:30' },
    { walkerId: 'murad', date: '2026-09-01', time: '12:00' },
    { walkerId: 'unknown', date: '2026-09-04', time: '17:30' }, null, 4,
    { walkerId: 'elvin', date: false, time: '17:30' },
  ] });
  assert.deepEqual(readConnections(raw, now), { favorites: [], meetings: [{ walkerId: 'nigar', date: '2026-09-05', time: '18:30' }] });
});
