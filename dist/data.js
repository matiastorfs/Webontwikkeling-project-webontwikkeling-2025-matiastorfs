import { MongoClient, } from "mongodb";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
export const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;
const client = new MongoClient(uri);
export const positionsCollection = client.db("webontwikkelingproject").collection("posities");
export const playersCollection = client.db("webontwikkelingproject").collection("spelers");
export const userCollection = client.db("login-express").collection("users");
export async function getData() {
    const positiesResponse = await fetch("https://raw.githubusercontent.com/matiastorfs/dataset-project-webontwikkeling/main/posities.json");
    let posities = await positiesResponse.json();
    const playersResponse = await fetch("https://raw.githubusercontent.com/matiastorfs/dataset-project-webontwikkeling/main/spelers.json");
    let spelers = await playersResponse.json();
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error(error);
    }
}
export async function getPlayerById(id) {
    return await playersCollection.findOne({ id: id });
}
export async function updatePlayer(id, naam, leeftijd, beschrijving, status) {
    await playersCollection.updateOne({ id: id }, {
        $set: {
            naam: naam,
            leeftijd: leeftijd,
            beschrijving: beschrijving,
            status: status
        }
    });
}
const saltRounds = 10;
async function createInitialUser() {
    if (await userCollection.countDocuments() > 0) {
        return;
    }
    let email = process.env.ADMIN_EMAIL;
    let password = process.env.ADMIN_PASSWORD;
    if (email === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await userCollection.insertOne({
        email: email,
        password: await bcrypt.hash(password, saltRounds),
        role: "ADMIN"
    });
}
export async function login(email, password) {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user = await userCollection.findOne({ email: email });
    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            return user;
        }
        else {
            throw new Error("Password incorrect");
        }
    }
    else {
        throw new Error("User not found");
    }
}
