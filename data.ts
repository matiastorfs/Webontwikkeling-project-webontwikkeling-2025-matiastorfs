import { Positie, Speler } from "./interfaces";
import { Collection, MongoClient, } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;
const client = new MongoClient(uri);

export const positionsCollection: Collection<Positie> = client.db("webontwikkelingproject").collection("posities");
export const playersCollection: Collection<Speler> = client.db("webontwikkelingproject").collection("spelers");

export async function getData() {
    const positiesResponse = await fetch("https://raw.githubusercontent.com/matiastorfs/dataset-project-webontwikkeling/main/posities.json");
    let posities: Positie[] = await positiesResponse.json();

    const playersResponse = await fetch("https://raw.githubusercontent.com/matiastorfs/dataset-project-webontwikkeling/main/spelers.json");
    let spelers: Speler[] = await playersResponse.json();

    return { posities, spelers };
}

export async function seed() {
    await client.connect();

    const data = await getData();

    if (await positionsCollection.countDocuments() === 0) {
        await positionsCollection.insertMany(data.posities);
    }

    if (await playersCollection.countDocuments() === 0) {
        await playersCollection.insertMany(data.spelers);
    }
}

export async function getPlayers() {
    return await playersCollection.find().toArray();
}

export async function getPositions() {
    return await positionsCollection.find().toArray();
}

async function exit() {
    try {
        await client.close();
        console.log('Disconnected from database');
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function connect() {
    try {
        await client.connect();
        await seed();
        console.log('Connected to database');
        process.on('SIGINT', exit);
    } catch (error) {
        console.error(error);
    }
}

