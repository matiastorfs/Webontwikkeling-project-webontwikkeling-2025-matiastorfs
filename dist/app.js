import express from "express";
import { getPlayers, getPositions, connect, getPlayerById, updatePlayer, login, register } from "./data.js";
import { secureMiddleware } from "./securemiddleware.js";
import { flashMiddleware } from "./flashmiddleware.js";
import { adminMiddleware } from "./adminMiddleware.js";
import session from "./session.js";
const app = express();
app.use(session);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(flashMiddleware);
app.set("view engine", "ejs");
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
app.get("/speler/:id", secureMiddleware, async (req, res) => {
    const id = req.params.id.toString();
    const speler = await getPlayerById(parseInt(id));
    res.render("details", {
        speler: speler
    });
});
app.get("/posities", async (req, res) => {
    const posities = await getPositions();
    const spelers = await getPlayers();
    res.render("posities", {
        posities: posities
    });
});
app.get("/posities/:position", async (req, res) => {
    const position = req.params.position;
    const posities = await getPositions();
    const spelers = await getPlayers();
    const positie = posities.find(positionItem => positionItem.afkorting === position);
    res.render("positiondetails", {
        positie: positie
    });
});
app.get("/speler/:id/edit", secureMiddleware, adminMiddleware, async (req, res) => {
    const id = req.params.id.toString();
    const speler = await getPlayerById(parseInt(id));
    if (!speler) {
        return res.status(404).send("Speler niet gevonden");
    }
    res.render("edit", { speler: speler });
});
app.post("/speler/:id/edit", secureMiddleware, adminMiddleware, async (req, res) => {
    if (!req.session.user || req.session.user.role !== "ADMIN") {
        req.session.message = { type: "error", message: "Alleen voor admins" };
        return res.redirect("/");
    }
    const id = parseInt(req.params.id.toString());
    const { naam, leeftijd, beschrijving, status } = req.body;
    await updatePlayer(id, naam, parseInt(leeftijd), beschrijving, status);
    res.redirect(`/speler/${id}`);
});
app.get("/login", (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect("/");
    }
    res.render("login");
});
app.post("/login", async (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect("/");
    }
    const email = req.body.email;
    const password = req.body.password;
    try {
        let user = await login(email, password);
        delete user.password;
        req.session.user = user;
        req.session.message = { type: "success", message: "Succesvol ingelogd!" };
        res.redirect("/");
    }
    catch (e) {
        res.redirect("/login");
    }
});
app.get("/registreer", (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect("/");
    }
    res.render("register");
});
app.post("/signin", async (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect("/");
    }
    const email = req.body.email;
    const password = req.body.password;
    try {
        await register(email, password);
        req.session.message = {
            type: "success",
            message: "Account succesvol aangemaakt! Je kunt nu inloggen."
        };
        res.redirect("/login");
    }
    catch (e) {
        req.session.message = { type: "error", message: e.message };
        res.redirect("/registreer");
    }
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
