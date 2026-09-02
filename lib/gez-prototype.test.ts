import assert from 'node:assert/strict';
import test from 'node:test';

import {
  advanceWalkStatus,
  filterGezWalkers,
  gezWalkers,
  getGezCopy,
  getWalkConditions,
  sanitizeStoredDog,
  toPersistedDog,
  walkStatuses,
} from './gez-prototype.ts';

void test('demo includes six distinct, believable Baku walkers', () => {
  assert.equal(gezWalkers.length, 6);
  assert.ok(new Set(gezWalkers.map((walker) => walker.district)).size >= 5);
  assert.ok(gezWalkers.every((walker) => walker.specialties.length >= 2));
  assert.ok(gezWalkers.some((walker) => walker.rating < 4.9));
  assert.ok(gezWalkers.some((walker) => walker.acceptedSizes.length === 1));
});

void test('walker discovery respects district and dog-size compatibility', () => {
  const largeDogMatches = filterGezWalkers(gezWalkers, {
    district: 'Yasamal',
    size: 'large',
  });

  assert.ok(largeDogMatches.length > 0);
  assert.ok(largeDogMatches.every((walker) => walker.district === 'Yasamal'));
  assert.ok(largeDogMatches.every((walker) => walker.acceptedSizes.includes('large')));
});

void test('booking statuses move forward and stop at completed', () => {
  assert.deepEqual(walkStatuses, ['requested', 'accepted', 'arriving', 'walking', 'completed']);
  assert.equal(advanceWalkStatus('requested'), 'accepted');
  assert.equal(advanceWalkStatus('walking'), 'completed');
  assert.equal(advanceWalkStatus('completed'), 'completed');
});

void test('simulated Baku weather gives useful, bounded walk guidance', () => {
  assert.equal(getWalkConditions(28).level, 'comfortable');
  assert.equal(getWalkConditions(33).level, 'hot');
  assert.match(getWalkConditions(33).message.en, /shorter|evening/i);
  assert.match(getWalkConditions(33).message.az, /qısa|axşam/i);
});

void test('Azerbaijani and English product copy have matching shapes', () => {
  assert.deepEqual(Object.keys(getGezCopy('az')).sort(), Object.keys(getGezCopy('en')).sort());
  assert.notEqual(getGezCopy('az').heroTitle, getGezCopy('en').heroTitle);
  assert.equal(getGezCopy('invalid' as never).heroTitle, getGezCopy('az').heroTitle);
});

void test('local prototype persistence excludes sensitive care and contact details', () => {
  const persisted = toPersistedDog({
    name: 'Milo', breed: 'Golden Retriever', age: 3, sex: 'male', weight: 28,
    size: 'large', energy: 'active', friendlyDogs: true, friendlyStrangers: true,
    pulls: false, reactive: false, treats: true, medical: 'private medical note',
    emergency: '+994 50 555 00 00', vet: 'Private vet', instructions: 'door code 1234',
  });

  assert.equal('medical' in persisted, false);
  assert.equal('emergency' in persisted, false);
  assert.equal('vet' in persisted, false);
  assert.equal('instructions' in persisted, false);
});

void test('stored dog data is allowlisted and bounded before use', () => {
  const dog = sanitizeStoredDog({
    name: 'X'.repeat(200), breed: '<script>alert(1)</script>', age: 999,
    weight: -10, size: 'giant', energy: 'turbo', friendlyDogs: 'yes',
  });

  assert.equal(dog.name.length, 40);
  assert.equal(dog.age, 30);
  assert.equal(dog.weight, 1);
  assert.equal(dog.size, 'large');
  assert.equal(dog.energy, 'active');
  assert.equal(dog.friendlyDogs, true);
});
