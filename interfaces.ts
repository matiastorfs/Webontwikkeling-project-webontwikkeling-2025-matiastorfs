import { ObjectId } from "mongodb";

export interface Positie {
  id: number
  naam: string
  afkorting: string
  isVerdedigend: boolean
  beschrijving: string
};

export interface Speler {
  _id?: ObjectId;
  id: number
  naam: string
  beschrijving: string
  leeftijd: number
  isActief: boolean
  geboortedatum: string
  imageUrl: string
  status: string
  hobbies: string[]
  positie: Positie
};

export interface SpelerPositie {
  id: number
  naam: string
  afkorting: string
};