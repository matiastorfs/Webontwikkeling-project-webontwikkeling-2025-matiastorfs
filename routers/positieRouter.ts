import express from "express";
import { getPlayers, getPositions} from "../data.js";

export default function positieRouter() {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const posities = await getPositions();
    const spelers = await getPlayers();
    res.render("posities", {
        posities : posities
    })
    });

    router.get("/:position", async (req, res) => {
    const position = req.params.position;
    const posities = await getPositions();
    const spelers = await getPlayers();

    const positie = posities.find(positionItem => positionItem.afkorting === position);

    res.render("positiondetails", {
        positie : positie
    })
});

  return router;
}