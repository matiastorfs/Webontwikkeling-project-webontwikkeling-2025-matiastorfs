import express from "express";
import { login } from "../data.js";
export default function loginRouter() {
    const router = express.Router();
    router.get("/", (req, res) => {
        if (req.session && req.session.user) {
            return res.redirect("/");
        }
        res.render("login");
    });
    router.post("/", async (req, res) => {
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
    return router;
}
