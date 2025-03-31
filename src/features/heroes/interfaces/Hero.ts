export default interface Hero {
  name: string;
  picture: string;
  attributes: {
    agility: number;
    strength: number;
    weight: number;
    endurance: number;
    charisma: number;
  };
  id: string;
}
