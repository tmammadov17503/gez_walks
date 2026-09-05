import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultDog } from './gez-prototype.ts';
import { addMinutesToTime, createWalkSnapshot, getWalkMetrics, preparationItems, toggleComparison, walkSessionText } from './gez-planning.ts';

void test('comparison is an immutable two-walker shortlist with allowlisted IDs', () => {
  const first = ['murad'];
  assert.deepEqual(toggleComparison(first, 'elvin'), ['murad', 'elvin']);
  assert.deepEqual(first, ['murad']);
  assert.deepEqual(toggleComparison(['murad', 'elvin'], 'nigar'), ['murad', 'elvin']);
  assert.deepEqual(toggleComparison(['murad', 'elvin'], 'murad'), ['elvin']);
  assert.deepEqual(toggleComparison([], 'unknown'), []);
});

void test('booking snapshots freeze the chosen identity and exclude private care data', () => {
  const dog = { ...defaultDog, name: 'Luna' };
  const walk = createWalkSnapshot({ walkerId: 'murad', dog, day: 'Tomorrow', time: '19:00', duration: 60 });
  assert.ok(walk);
  assert.equal(walk.walkerId, 'murad');
  assert.equal(walk.dogName, 'Luna');
  assert.equal(walk.duration, 60);
  assert.equal(walk.price, 17);
  assert.ok(Object.isFrozen(walk));
  assert.equal('medical' in walk, false);
  assert.equal('emergency' in walk, false);
  assert.equal('instructions' in walk, false);
});

void test('invalid or incompatible bookings are rejected at the action boundary', () => {
  const input = { walkerId: 'murad', dog: defaultDog, day: 'Today', time: '18:30', duration: 45 };
  for (const override of [{ walkerId: 'unknown' }, { walkerId: 'leyla' }, { day: 'Yesterday' }, { time: '24:70' }, { duration: 0 }, { duration: 47 }, { duration: NaN }]) {
    assert.equal(createWalkSnapshot({ ...input, ...override }), null);
  }
  assert.equal(createWalkSnapshot({ ...input, dog: { ...defaultDog, name: '  Luna  ' } })?.dogName, 'Luna');
  assert.equal(createWalkSnapshot({ ...input, dog: { ...defaultDog, name: '' } })?.dogName, 'Milo');
});

void test('checklist respects the current dog’s treat permission', () => {
  assert.deepEqual(preparationItems(false), ['leash', 'water', 'pickup']);
  assert.deepEqual(preparationItems(true), ['leash', 'water', 'pickup', 'treats']);
});

void test('all languages carry the booked walker and dog through the report and rebook labels', () => {
  const session = createWalkSnapshot({ walkerId: 'murad', dog: { ...defaultDog, name: 'Luna' }, day: 'Today', time: '19:00', duration: 45 })!;
  for (const locale of ['en', 'az', 'ru'] as const) {
    const text = walkSessionText(session, locale);
    assert.match(text.received, /Murad/);
    assert.match(text.liveTitle, /Luna/);
    assert.match(text.reportTitle, /Luna/);
    assert.match(text.bookAgain, /Murad/);
    assert.match(text.rate, /Murad/);
    assert.doesNotMatch(JSON.stringify(text), /Nigar|Milo/);
  }
});

void test('simulated metrics scale with duration and clamp route progress', () => {
  assert.deepEqual(getWalkMetrics(45, 100), { minutes: 42, distance: '2.7', steps: 4180 });
  assert.equal(getWalkMetrics(30, 100).minutes, 27);
  assert.equal(getWalkMetrics(90, 100).minutes, 87);
  assert.equal(getWalkMetrics(45, -5).minutes, 0);
  assert.deepEqual(getWalkMetrics(45, 200), getWalkMetrics(45, 100));
  assert.deepEqual(getWalkMetrics(45, NaN), getWalkMetrics(45, 0));
});

void test('walk update times follow the booked start time and wrap after midnight', () => {
  assert.equal(addMinutesToTime('18:30', 1), '18:31');
  assert.equal(addMinutesToTime('18:30', 24), '18:54');
  assert.equal(addMinutesToTime('23:50', 20), '00:10');
});
