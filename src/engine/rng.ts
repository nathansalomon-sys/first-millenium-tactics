/**
 * Seeded random numbers (mulberry32).
 *
 * The engine never calls Math.random(). Every roll comes from an RngState that
 * lives in the match state, so the same state + orders + seed always produce
 * the same result. That is what makes tests, replays, the AI's look-ahead and
 * (later) a server-checked online mode possible.
 *
 * The functions are pure: they return the value and the next state instead of
 * mutating anything.
 */

export type RngState = number;

export interface Roll<T> {
  readonly value: T;
  readonly rng: RngState;
}

export function createRng(seed: number): RngState {
  return seed >>> 0;
}

/** A float in [0, 1). */
export function nextFloat(rng: RngState): Roll<number> {
  const next = (rng + 0x6d2b79f5) >>> 0;
  let t = next;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { value, rng: next };
}

/** A float in [min, max). */
export function nextInRange(rng: RngState, min: number, max: number): Roll<number> {
  const roll = nextFloat(rng);
  return { value: min + roll.value * (max - min), rng: roll.rng };
}

/** An integer in [min, max], both ends included. */
export function nextInt(rng: RngState, min: number, max: number): Roll<number> {
  const roll = nextFloat(rng);
  return { value: min + Math.floor(roll.value * (max - min + 1)), rng: roll.rng };
}
