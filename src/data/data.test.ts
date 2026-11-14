/**
 * Pins the balance data to the numbers written in docs/GDD.md.
 * If a playtest changes a number, change the GDD and this test together.
 */
import { describe, expect, it } from 'vitest';
import { moraleMultiplier, rules, sizes, unitCost, units } from './index';

describe('unit costs (GDD: Army building & generals)', () => {
  it('matches the cost table', () => {
    expect(unitCost('infantry', 'small')).toBe(60);
    expect(unitCost('infantry', 'medium')).toBe(100);
    expect(unitCost('infantry', 'large')).toBe(150);
    expect(unitCost('archers', 'small')).toBe(54);
    expect(unitCost('archers', 'medium')).toBe(90);
    expect(unitCost('archers', 'large')).toBe(135);
    expect(unitCost('cavalry', 'small')).toBe(96);
    expect(unitCost('cavalry', 'medium')).toBe(160);
    expect(unitCost('cavalry', 'large')).toBe(240);
  });

  it('prices the example default army at 960 points, inside the budget and unit cap', () => {
    const army = rules.army.exampleDefaultArmy;
    const total = army.reduce(
      (sum, entry) =>
        sum +
        entry.count * unitCost(entry.type as keyof typeof units, entry.size as keyof typeof sizes),
      0,
    );
    const unitCount = army.reduce((sum, entry) => sum + entry.count, 0);
    expect(total).toBe(960);
    expect(total).toBeLessThanOrEqual(rules.army.defaultBudget);
    expect(unitCount).toBeLessThanOrEqual(rules.army.maxUnits);
  });
});

describe('morale multiplier (GDD: Combat model)', () => {
  it('is x0.75 at morale 0, x1.0 at 50 and x1.25 at 100', () => {
    expect(moraleMultiplier(0)).toBeCloseTo(0.75);
    expect(moraleMultiplier(50)).toBeCloseTo(1.0);
    expect(moraleMultiplier(100)).toBeCloseTo(1.25);
  });
});

describe('worked examples (GDD: Combat model, Draft balance tables)', () => {
  const infantry = units.infantry;
  const arc = rules.damage.arcMultiplier;

  it('medium infantry into an infantry front on open ground deals about 13 per turn', () => {
    const damage =
      infantry.melee *
      (sizes.medium.hp / 100) *
      arc.front *
      moraleMultiplier(infantry.startingMorale) *
      (1 - infantry.frontDamageReduction);
    expect(damage).toBeCloseTo(13.2);
    expect(damage * rules.damage.bleedToHpWhileSteady.melee).toBeCloseTo(1.32);
    // "The defender breaks in about 8 turns."
    expect(Math.ceil(infantry.endurance / damage)).toBe(8);
  });

  it('the same attack into the flank deals 33 per turn and breaks the target in about 3 turns', () => {
    const damage = infantry.melee * arc.flank * moraleMultiplier(infantry.startingMorale);
    expect(damage).toBeCloseTo(33);
    expect(Math.round(infantry.endurance / damage)).toBe(3);
  });

  it('a medium cavalry charge into a flank deals 45 shock', () => {
    expect(units.cavalry.shock * sizes.medium.shockMultiplier * arc.flank).toBeCloseTo(45);
  });

  it('cavalry has twice the infantry MP', () => {
    expect(units.cavalry.mp).toBe(2 * infantry.mp);
  });
});

describe('timers (GDD: Timers & win conditions)', () => {
  it('uses 1:30 per turn, 10:00 per player and 25:00 per match', () => {
    expect(rules.timers).toEqual({ turnSeconds: 90, playerSeconds: 600, matchSeconds: 1500 });
  });
});
