import express from "express";
import { getPlayers, connect } from "./data.js";
import { secureMiddleware } from "./securemiddleware.js";
import { flashMiddleware } from "./flashmiddleware.js";
import session from "./session.js";
import loginRouter from "./routers/loginRouter.js";
import positieRouter from "./routers/positieRouter.js";
import registreerRouter from "./routers/registreerRouter.js";
import spelersRouter from "./routers/spelersRouter.js";
import { adminMiddleware } from "./adminMiddleware.js";
const app = express();
app.use(session);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(flashMiddleware);
app.set("view engine", "ejs");
app.use("/login", flashMiddleware, loginRouter());
app.use("/posities", secureMiddleware, positieRouter());
app.use("/registreer", flashMiddleware, registreerRouter());
app.use("/speler/:id", secureMiddleware, adminMiddleware, spelersRouter());
app.get("/", secureMiddleware, async (req, res) => {
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
    let q = typeof req.query.q === "string" ? req.query.q : "";
    const spelers = await getPlayers();
    const playerFilter = await spelers.filter((speler) => {
        return speler.naam.toLowerCase().includes(q.toLowerCase());
    });
    playerFilter.sort((a, b) => {
        if (sortField === "name") {
            return sortDirection === "asc" ? a.naam.localeCompare(b.naam) : b.naam.localeCompare(a.naam);
        }
        else if (sortField === "age") {
            return sortDirection === "asc" ? a.leeftijd - b.leeftijd : b.leeftijd - a.leeftijd;
        }
        else {
            return 0;
        }
    });
    res.render("index", {
        spelers: playerFilter,
        q: q,
        sortDirection: sortDirection,
        sortField: sortField
    });
});
app.post("/logout", async (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});
app.listen(1234, async () => {
    await connect();
    console.log("Server runt op poort 1234");
});
