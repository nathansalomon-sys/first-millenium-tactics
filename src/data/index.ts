/**
 * Balance data. Every number from docs/GDD.md lives in these JSON files, not in
 * code, so tuning after a playtest is a data change. src/data/data.test.ts pins
 * the values the GDD states explicitly.
 */
import generals from './generals.json';
import rules from './rules.json';
import sizes from './sizes.json';
import terrain from './terrain.json';
import units from './units.json';

export type UnitType = keyof typeof units;
export type UnitSize = keyof typeof sizes;
export type TerrainType = keyof typeof terrain;
export type GeneralId = keyof typeof generals;

export const UNIT_TYPES = Object.keys(units) as UnitType[];
export const UNIT_SIZES = Object.keys(sizes) as UnitSize[];

export { generals, rules, sizes, terrain, units };

/** Points cost of one unit: the type's base cost x the size's cost multiplier. */
export function unitCost(type: UnitType, size: UnitSize): number {
  return Math.round(units[type].baseCost * sizes[size].costMultiplier);
}

/** Damage multiplier from morale: x0.75 at 0, x1.0 at 50, x1.25 at 100. */
export function moraleMultiplier(morale: number): number {
  const { base, perMoralePoint } = rules.damage.moraleMultiplier;
  return base + morale * perMoralePoint;
}
