import type Hero from "../features/heroes/interfaces/Hero";

export interface ChallengeContext {
  winsHistory: Record<string, number>; // hero.name → number of wins
  totalScore: Record<string, number>;
  RoundScore: Record<string, number>; // current round score
  competitors: Hero[];
}
