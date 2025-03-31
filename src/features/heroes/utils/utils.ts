import type { ChallengeContext } from "../../../interfaces/ArenaCompetitions";
import type Hero from "../interfaces/Hero";
import type { RankedHero } from "../../../interfaces/RankedHero";

async function handle<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    return [null, err as Error];
  }
}

function climbSkyscraper(hero: Hero): number {
  const { strength, weight } = hero.attributes;
  return strength * 4 - weight * 2;
}

function tellJoke(hero: Hero, opponents: Hero[]): number {
  const { charisma } = hero.attributes;
  const opponentCharismaSum = opponents.reduce(
    (sum, h) => sum + h.attributes.charisma,
    0
  );
  return charisma ** 2 - opponentCharismaSum;
}

function throwVillain(hero: Hero, isLast: boolean): number {
  const { agility, strength } = hero.attributes;
  return agility + strength + (isLast ? 5 : 0);
}

function run200Km(hero: Hero, position: number): number {
  const { agility, endurance } = hero.attributes;
  return agility * 4 + endurance * 2 + (position === 0 ? 10 : -1);
}

function rescueKittens(hero: Hero, wins: number): number {
  const { agility } = hero.attributes;
  return agility * 2 + (wins >= 2 ? 5 : 0);
}

export function getScoresForAllChallenges(
  heroes: Hero[],
  context: ChallengeContext = {}
): RankedHero[] {
  const { previousWins = {}, previousRanking = [] } = context;

  const scores = heroes.map((hero) => {
    const opponents = heroes.filter((h) => h.name !== hero.name);
    const isLast = previousRanking[previousRanking.length - 1] === hero.name;
    const position = previousRanking.indexOf(hero.name);
    const wins = previousWins[hero.name] ?? 0;

    const totalScore =
      climbSkyscraper(hero) +
      tellJoke(hero, opponents) +
      throwVillain(hero, isLast) +
      run200Km(hero, position) +
      rescueKittens(hero, wins);

    return {
      totalScore,
      ...hero,
    };
  });

  const sorted = scores.sort((a, b) => b.totalScore - a.totalScore);

  return sorted.map((hero, index) => ({
    ...hero,
    rank: index + 1,
  }));
}

export { handle };
