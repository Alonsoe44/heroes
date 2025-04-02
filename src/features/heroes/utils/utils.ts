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
    .filter(([_, score]) => score === worstScore)
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

  context.competitors.forEach((hero) => {
    newContext.RoundScore[hero.name] = startGenericCompetition(hero, context);
  });

  const biggestScore: number = Math.max(
    ...Object.values(newContext.RoundScore)
  );
  const currentWinner = Object.entries(context.RoundScore).filter(
    ([_, score]) => biggestScore === score
  );
  currentWinner.forEach(([winner]) => {
    context.winsHistory[winner] = context.winsHistory[winner] + 1;
    context.totalScore[winner] = context.totalScore[winner] + 5;
  });

  const heroesWithoutWinner: [string, number][] = Object.entries(
    newContext.RoundScore
  ).filter(([_, score]) => score !== biggestScore);

  const biggestScoreSecondPlace: number = Math.max(
    ...heroesWithoutWinner.map(([_, score]) => score)
  );
  const currentSecondPlace: [string, number][] = heroesWithoutWinner.filter(
    ([_, score]) => biggestScoreSecondPlace === score
  );
  currentSecondPlace.forEach(([secondPlace]) => {
    context.totalScore[secondPlace] = context.totalScore[secondPlace] + 3;
  });

  const heroesWithoutSecondPlace: [string, number][] =
    heroesWithoutWinner.filter(
      ([_, score]) => score !== biggestScoreSecondPlace
    );
  const biggestScoreThirdPlace: number = Math.max(
    ...heroesWithoutSecondPlace.map(([_, score]) => score)
  );
  const currentThirdPlace: [string, number][] = heroesWithoutSecondPlace.filter(
    ([_, score]) => biggestScoreThirdPlace === score
  );
  currentThirdPlace.forEach(([thirdPlace]) => {
    context.totalScore[thirdPlace] = context.totalScore[thirdPlace] + 1;
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
  console.log("start context");
  console.log(startContext.totalScore);
  const firsRoundContext = getRoundScore(startContext, startClimbSkyscraper);
  console.log("first round");
  console.log(firsRoundContext.totalScore);
  const secondRoundContext = getRoundScore(firsRoundContext, startTellJoke);
  console.log("second round");
  console.log(secondRoundContext.totalScore);
  const thirdRoundContext = getRoundScore(
    secondRoundContext,
    startThrowVillain
  );
  console.log("third round");
  console.log(thirdRoundContext.totalScore);
  const fourthRoundContext = getRoundScore(thirdRoundContext, startRun200Km);
  console.log("fourth round");
  console.log(fourthRoundContext.totalScore);
  const fifthRoundContext = getRoundScore(
    fourthRoundContext,
    startRescueKittens
  );
  console.log("fifth round");
  console.log(fifthRoundContext.totalScore);

  const heroesScore = heroes.map((heroe) => ({
    ...heroe,
    totalScore: fifthRoundContext.totalScore[heroe.name],
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
