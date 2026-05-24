export function flashMiddleware(req, res, next) {
    if (req.session.message) {
        res.locals.message = req.session.message;
        delete req.session.message;
    }
    else {
        res.locals.message = undefined;
    }
    if (!req.session.user) {
        res.locals.user = undefined;
    }
    next();
}
;
