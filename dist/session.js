import { uri } from "./data.js";
import session from "express-session";
import MongoStore from 'connect-mongo';
const mongoStore = MongoStore.create({
    mongoUrl: uri,
    dbName: "sessions",
    collectionName: "login-express"
});
mongoStore.on("error", (error) => {
    console.error(error);
});
export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
});
