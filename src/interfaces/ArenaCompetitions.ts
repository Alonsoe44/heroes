export interface ChallengeContext {
  previousWins?: Record<string, number>; // hero.name → number of wins
  previousRanking?: string[]; // from first to last
}
