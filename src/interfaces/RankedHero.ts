import type Hero from "../features/heroes/interfaces/Hero";

export interface RankedHero extends Hero {
  totalScore: number;
  rank: number;
}
