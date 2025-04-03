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

function startClimbSkyscraper(hero: Hero, _: ChallengeContext): number {
  const { strength, weight } = hero.attributes;
  return strength * 4 - weight * 2;
}

function startTellJoke(hero: Hero, context: ChallengeContext): number {
  const opponents: Hero[] = context.competitors.filter(
    (h) => h.name !== hero.name
  );
  const { charisma } = hero.attributes;
  const opponentCharismaSum = opponents.reduce(
    (sum, h) => sum + h.attributes.charisma,
    0
  );
  return charisma ** 2 - opponentCharismaSum;
}

function startThrowVillain(hero: Hero, context: ChallengeContext): number {
  const worstScore = Math.min(...Object.values(context.totalScore));
  const worstHeroes = Object.entries(context.totalScore)
    .filter(([, score]) => score === worstScore)
    .map(([heroName]) => heroName);

  const isLast = worstHeroes.find((heroName) => heroName === hero.name);
  const { agility, strength } = hero.attributes;
  return agility + strength + (isLast ? 5 : 0);
}

function startRun200Km(hero: Hero, context: ChallengeContext): number {
  const bestScore = Math.max(...Object.values(context.RoundScore));
  const wonLastRound = context.RoundScore[hero.name] === bestScore;
  const { agility, endurance } = hero.attributes;
  return agility * 4 + endurance * 2 + (wonLastRound ? 10 : -1);
}

function startRescueKittens(hero: Hero, context: ChallengeContext): number {
  const wonAtLeast2Rounds = context.winsHistory[hero.name] >= 2;
  const { agility } = hero.attributes;
  return agility * 2 + (wonAtLeast2Rounds ? 5 : 0);
}

const getRoundScore = (
  context: ChallengeContext,
  startGenericCompetition: (hero: Hero, context: ChallengeContext) => number
): ChallengeContext => {
  const newContext: ChallengeContext = {
    ...context,
  };

  const heroesScore: [string, number][] = context.competitors.map((hero) => {
    return [hero.name, startGenericCompetition(hero, context)];
  });

  const sortedHeroesScore = heroesScore.sort((a, b) => b[1] - a[1]);

  const ranked = sortedHeroesScore.reduce<[string, number][][]>((acc, curr) => {
    const lastGroup = acc[acc.length - 1];
    if (!lastGroup || lastGroup[0][1] !== curr[1]) {
      acc.push([curr]);
    } else {
      lastGroup.push(curr);
    }
    return acc;
  }, []);

  ranked.forEach((group, index) => {
    group.forEach(([heroName]) => {
      newContext.RoundScore[heroName] = group[0][1];
      newContext.totalScore[heroName] =
        newContext.totalScore[heroName] +
        (index === 0 ? 5 : index === 1 ? 3 : 1);
      newContext.winsHistory[heroName] =
        newContext.winsHistory[heroName] + (index === 0 ? 1 : 0);
    });
  });

  return newContext;
};

const getFinalRanking = (heroes: Hero[]): RankedHero[] => {
  const startContext: ChallengeContext = {
    winsHistory: {},
    totalScore: heroes.reduce((acc, hero) => {
      acc[hero.name] = 0;
      return acc;
    }, {} as Record<string, number>),
    competitors: heroes,
    RoundScore: {},
  };

  const pipeRounds = (
    ...rounds: ((hero: Hero, context: ChallengeContext) => number)[]
  ) => rounds.reduce((ctx, round) => getRoundScore(ctx, round), startContext);

  const finalContext = pipeRounds(
    startClimbSkyscraper,
    startTellJoke,
    startThrowVillain,
    startRun200Km,
    startRescueKittens
  );
  const heroesScore = heroes.map((heroe) => ({
    ...heroe,
    totalScore: finalContext.totalScore[heroe.name],
  }));

  const sorted = heroesScore.sort((a, b) => b.totalScore - a.totalScore);
  const rankedHeroes = sorted.map((hero, i) => ({
    ...hero,
    rank: i + 1,
  }));

  return rankedHeroes;
};

export {
  handle,
  getFinalRanking,
  startClimbSkyscraper,
  startTellJoke,
  startThrowVillain,
  startRun200Km,
  startRescueKittens,
  getRoundScore,
};
