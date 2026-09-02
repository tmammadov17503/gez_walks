/* oxlint-disable typescript/no-floating-promises */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  matchWalkers,
  parseBookingInput,
  parseDogInput,
  type Walker,
} from './marketplace.ts';

describe('dog profile validation', () => {
  it('accepts a safe, complete dog profile', () => {
    const result = parseDogInput({
      name: 'Milo',
      breed: 'Cocker Spaniel',
      ageYears: '3',
      size: 'medium',
      energy: 'high',
      notes: 'Friendly, pulls a little at first.',
    });

    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.value.name, 'Milo');
  });

  it('rejects blank names and impossible ages', () => {
    assert.equal(parseDogInput({ name: '   ', ageYears: '-2' }).ok, false);
    assert.equal(parseDogInput({ name: 'Milo', ageYears: '31' }).ok, false);
  });

  it('rejects unsupported size values', () => {
    assert.equal(parseDogInput({ name: 'Milo', ageYears: '3', size: 'giant' }).ok, false);
  });
});

describe('booking validation', () => {
  it('accepts supported Baku districts and walk durations', () => {
    const result = parseBookingInput({
      dogId: 'dog_12345678',
      walkerId: 'aysel',
      district: 'Yasamal',
      duration: '45',
      scheduledFor: '2026-09-03T18:30',
    });

    assert.equal(result.ok, true);
  });

  it('rejects unknown districts and durations', () => {
    assert.equal(parseBookingInput({ dogId: 'dog_12345678', walkerId: 'aysel', district: 'London', duration: '30', scheduledFor: '2026-09-03T18:30' }).ok, false);
    assert.equal(parseBookingInput({ dogId: 'dog_12345678', walkerId: 'aysel', district: 'Yasamal', duration: '25', scheduledFor: '2026-09-03T18:30' }).ok, false);
  });
});

describe('walker matching', () => {
  const walkers: Walker[] = [
    { id: 'aysel', name: 'Aysel', district: 'Yasamal', rating: 4.97, walks: 126, largeDogs: true, nextAvailableMinutes: 35, price30: 12 },
    { id: 'murad', name: 'Murad', district: 'Yasamal', rating: 4.92, walks: 88, largeDogs: false, nextAvailableMinutes: 15, price30: 10 },
    { id: 'leyla', name: 'Leyla', district: 'Nərimanov', rating: 5, walks: 64, largeDogs: true, nextAvailableMinutes: 20, price30: 14 },
  ];

  it('returns same-district walkers ordered by soonest availability then rating', () => {
    assert.deepEqual(matchWalkers(walkers, { district: 'Yasamal', dogSize: 'medium' }).map((walker) => walker.id), ['murad', 'aysel']);
  });

  it('keeps only large-dog capable walkers for large dogs', () => {
    assert.deepEqual(matchWalkers(walkers, { district: 'Yasamal', dogSize: 'large' }).map((walker) => walker.id), ['aysel']);
  });
});
