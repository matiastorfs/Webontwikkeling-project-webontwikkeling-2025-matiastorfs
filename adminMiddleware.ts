import { NextFunction, Request, Response } from "express";

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.user && req.session.user.role === "ADMIN") {
        return next(); // Gebruiker is admin, ga door!
    }
    
    req.session.message = { type: "error", message: "Toegang geweigerd: Alleen voor administrators." };
    res.redirect("/");
}