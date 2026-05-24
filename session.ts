import { uri } from "./data.js";
import session, { MemoryStore } from "express-session";
import { User, FlashMessage } from "./interfaces.js";
import MongoStore from 'connect-mongo'

const mongoStore = MongoStore.create({
    mongoUrl: uri,
    dbName: "sessions",
    collectionName: "login-express"   
});

mongoStore.on("error", (error) => {
    console.error(error);
});

declare module 'express-session' {
    export interface SessionData {
        user?: User
        message?: FlashMessage;
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
});