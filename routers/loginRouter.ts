import express from "express";
import {login} from "../data.js";
import { User } from "../interfaces.js";

export default function loginRouter() {
  const router = express.Router();

  router.get("/", async (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect("/");
    }
    
    res.render("login");
    });

    router.post("/", async(req, res) => {
    if (req.session && req.session.user) {
        return res.redirect("/");
    }

    const email : string = req.body.email;
    const password : string = req.body.password;
    try {
        let user : User = await login(email, password);
        delete user.password;
        req.session.user = user;
        req.session.message = { type: "success", message: "Succesvol ingelogd!" };
        res.redirect("/");
    } catch (e : any) {
        res.redirect("/login");
    }
    });

  return router;
}