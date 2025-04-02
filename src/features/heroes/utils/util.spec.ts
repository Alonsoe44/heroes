import { describe, it, expect } from "vitest";
import {
  getFinalRanking,
  getRoundScore,
  startClimbSkyscraper,
  startRescueKittens,
  startRun200Km,
  startTellJoke,
  startThrowVillain,
} from "./utils";
import type Hero from "../interfaces/Hero";

describe("Utils", () => {
  // Test data
  const mockHeroes: Hero[] = [
    {
      id: "1",
      name: "Superman",
      picture: "base64...",
      attributes: {
        strength: 10,
        agility: 8,
        weight: 7,
        endurance: 9,
        charisma: 8,
      },
    },
    {
      id: "2",
      name: "Flash",
      picture: "base64...",
      attributes: {
        strength: 6,
        agility: 10,
        weight: 5,
        endurance: 8,
        charisma: 7,
      },
    },
    {
      id: "3",
      name: "Invincible",
      picture: "base64...",
      attributes: {
        strength: 8,
        agility: 7,
        weight: 5,
        endurance: 7,
        charisma: 6,
      },
    },
  ];

  describe("Competition Functions", () => {
    const mockContext = {
      competitors: mockHeroes,
      winsHistory: { Superman: 2, Flash: 1, Invincible: 0 },
      totalScore: { Superman: 20, Flash: 14, Invincible: 11 },
      RoundScore: { Superman: 13, Flash: 8, Invincible: 9 },
    };

    describe("startClimbSkyscraper", () => {
      it("should calculate score based on strength and weight", () => {
        const hero = mockHeroes[0]; // Superman
        const score = startClimbSkyscraper(hero, mockContext);
        const expected =
          hero.attributes.strength * 4 - hero.attributes.weight * 2;

        expect(score).toBe(expected);
      });
    });

    describe("startTellJoke", () => {
      it("should calculate score based on charisma and opponents", () => {
        const hero = mockHeroes[2]; // Invincible
        const score = startTellJoke(hero, mockContext);
        const expectedScore = Math.pow(hero.attributes.charisma, 2) - 15;

        expect(score).toBe(expectedScore);
      });
    });

    describe("startThrowVillain", () => {
      it("should calculate score based on strength and endurance", () => {
        const hero = mockHeroes[1]; // Flash
        const score = startThrowVillain(hero, mockContext);
        const expectedScore =
          hero.attributes.agility + hero.attributes.strength + 0;

        expect(score).toBe(expectedScore);
      });
    });

    describe("startRun200Km", () => {
      it("should calculate score based on agility and endurance", () => {
        const hero = mockHeroes[2]; // Invincible
        const score = startRun200Km(hero, mockContext);
        const expectedScore =
          hero.attributes.agility * 4 + hero.attributes.endurance * 2 + -1;

        expect(score).toBe(expectedScore);
      });
    });

    describe("startRescueKittens", () => {
      it("should calculate score based on agility and wins", () => {
        const hero = mockHeroes[0]; // Superman
        const score = startRescueKittens(hero, mockContext);
        const expectedScore = hero.attributes.agility * 2 + 5;

        expect(score).toBe(expectedScore);
      });
    });

    describe("getRoundScore", () => {
      it("should calculate score based on competition functions", () => {
        const score = getRoundScore(mockContext, startClimbSkyscraper);
        const expectedContext = {
          RoundScore: { Superman: 26, Flash: 14, Invincible: 22 },
          winsHistory: { Superman: 3, Flash: 1, Invincible: 0 },
          totalScore: { Superman: 25, Flash: 15, Invincible: 14 },
          competitors: mockHeroes,
        };

        expect(score).toEqual(expectedContext);
      });
    });

    describe("getFinalRanking", () => {
      it("should calculate final ranking based on total score", () => {
        const ranking = getFinalRanking(mockHeroes);
        const expectedRanking = [
          {
            id: "1",
            name: "Superman",
            picture: "base64...",
            attributes: {
              strength: 10,
              agility: 8,
              weight: 7,
              endurance: 9,
              charisma: 8,
            },
            totalScore: 25,
            rank: 1,
          },
          {
            id: "2",
            name: "Flash",
            picture: "base64...",
            attributes: {
              strength: 6,
              agility: 10,
              weight: 5,
              endurance: 8,
              charisma: 7,
            },
            totalScore: 15,
            rank: 2,
          },
          {
            id: "3",
            name: "Invincible",
            picture: "base64...",
            attributes: {
              strength: 8,
              agility: 7,
              weight: 5,
              endurance: 7,
              charisma: 6,
            },
            totalScore: 14,
            rank: 3,
          },
        ];
        console.log("result ranking");
        console.log(ranking);

        expect(ranking).toEqual(expectedRanking);
      });
    });
  });
});
