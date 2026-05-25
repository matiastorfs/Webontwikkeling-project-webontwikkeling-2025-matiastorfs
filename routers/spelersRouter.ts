import express from "express";
import { getPlayerById, updatePlayer } from "../data.js";
import { secureMiddleware } from "../securemiddleware.js";
import { adminMiddleware } from "../adminMiddleware.js";

export default function spelersRouter() {
    const router = express.Router({ mergeParams: true });

  router.get("/:id", async (req, res) => {
    const id = req.params.id.toString();

    const speler = await getPlayerById(parseInt(id));


    res.render("details", {
        speler: speler
    });
});

router.get("/:id/edit", adminMiddleware, async (req, res) => {
    const id = req.params.id.toString();
    const speler = await getPlayerById(parseInt(id));

    if (!speler) {
        return res.status(404).send("Speler niet gevonden");
    }

    res.render("edit", { speler: speler });
});

router.post("/:id/edit", adminMiddleware, async (req, res) => {
    if (!req.session.user || req.session.user.role !== "ADMIN") {
        req.session.message = { type: "error", message: "Alleen voor admins" };
        return res.redirect("/");
    }
    const id = parseInt(req.params.id.toString());
    
    const { naam, leeftijd, beschrijving, status } = req.body;

    await updatePlayer(
        id, 
        naam, 
        parseInt(leeftijd), 
        beschrijving, 
        status
    );

    res.redirect(`/speler/${id}`);
});

  return router;
}