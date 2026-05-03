import express from "express";
import ejs from "ejs";
import { getPlayers, getPositions, connect } from "./data";

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
    let q : string = typeof req.query.q === "string" ? req.query.q : "";

    const spelers = await getPlayers();


    const playerFilter = await spelers.filter((speler) => {
        return speler.naam.toLowerCase().includes(q.toLowerCase());
    });

    playerFilter.sort((a, b) => {
    if (sortField === "name") {
        return sortDirection === "asc" ? a.naam.localeCompare(b.naam) : b.naam.localeCompare(a.naam);
    } else if (sortField === "age") {
        return sortDirection === "asc" ? a.leeftijd - b.leeftijd : b.leeftijd - a.leeftijd;
    } else {
        return 0;
    }
    });

    res.render("index", {
        spelers: playerFilter,
        q : q,
        sortDirection : sortDirection,
        sortField : sortField
    });
});

app.get("/speler/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const spelers = await getPlayers();
    
    const speler = spelers.find(speler => speler.id === id);

    res.render("details", {
        speler: speler
    });
});

app.get("/posities", async (req, res) => {
    const posities = await getPositions();
    const spelers = await getPlayers();
    res.render("posities", {
        posities : posities
    })
});

app.get("/posities/:position", async (req, res) => {
    const position = req.params.position;
    const posities = await getPositions();
    const spelers = await getPlayers();

    const positie = posities.find(positionItem => positionItem.afkorting === position);

    res.render("positiondetails", {
        positie : positie
    })
});

app.listen(1234, async () => {
    await connect();
    console.log("Server runt op poort 1234");
});