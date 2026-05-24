import { Positie, Speler } from "./interfaces.js";
import { Collection, MongoClient, } from "mongodb";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "./interfaces.js";

dotenv.config();

export const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;
const client = new MongoClient(uri);

export const positionsCollection: Collection<Positie> = client.db("webontwikkelingproject").collection("posities");
export const playersCollection: Collection<Speler> = client.db("webontwikkelingproject").collection("spelers");

const userCollection: Collection<User> = client
  .db("webontwikkelingproject")
  .collection<User>("users");

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
        await createInitialUser();
        await client.connect();
        await seed();
        console.log('Connected to database');
        process.on('SIGINT', exit);
    } catch (error) {
        console.error(error);
    }
}

export async function getPlayerById(id: number) {
    return await playersCollection.findOne({ id: id });
}

export async function updatePlayer(id: number, naam: string, leeftijd: number, beschrijving: string, status: string) {
    await playersCollection.updateOne(
        { id: id },
        { 
            $set: { 
                naam: naam, 
                leeftijd: leeftijd, 
                beschrijving: beschrijving, 
                status: status 
            } 
        }
    );
}

const saltRounds : number = 10;

async function createInitialUser() {
    if (await userCollection.countDocuments() > 0) {
        return;
    }
    let email : string | undefined = process.env.ADMIN_EMAIL;
    let password : string | undefined = process.env.ADMIN_PASSWORD;
    if (email === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await userCollection.insertOne({
        email: email,
        password: await bcrypt.hash(password, saltRounds),
        role: "ADMIN"
    });
}

export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : User | null = await userCollection.findOne<User>({email: email});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}

export async function register(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }

    const existingUser = await userCollection.findOne({ email: email });
    if (existingUser) {
        throw new Error("User already exists with this email");
    }

    await userCollection.insertOne({
        email: email,
        password: await bcrypt.hash(password, saltRounds),
        role: "USER"
    });
}
