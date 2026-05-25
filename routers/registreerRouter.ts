import express from "express";
import { register } from "../data.js";

export default function registreerRouter() {
  const router = express.Router();

    router.get("/", (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect("/");
    }
    
    res.render("register");
    });

    router.post("/", async (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect("/");
    }

    const email : string = req.body.email;
    const password : string = req.body.password;

    try {
        await register(email, password);
        
        req.session.message = { 
            type: "success", 
            message: "Account succesvol aangemaakt! Je kunt nu inloggen." 
        };
        res.redirect("/login");

    } catch (e : any) {
        req.session.message = { type: "error", message: e.message };
        res.redirect("/registreer");
    }
});

  return router;
}