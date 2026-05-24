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

export interface User {
    _id?: ObjectId;
    email: string;
    password?: string;
    role: "ADMIN" | "USER";
}

export interface FlashMessage {
    type: "error" | "success"
    message: string;
}