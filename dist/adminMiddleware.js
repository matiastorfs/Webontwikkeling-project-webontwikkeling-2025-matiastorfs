export function adminMiddleware(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === "ADMIN") {
        return next(); // Gebruiker is admin, ga door!
    }
    req.session.message = { type: "error", message: "Toegang geweigerd: Alleen voor administrators." };
    res.redirect("/");
}
