import express from "express";
import passportStrat from "../strategies/discord";
const router = express.Router();

var isAuthenticated = function (req, res) {
    if (req.isAuthenticated()) {
        return true;
    }
}

var getPassportSession = function (req, res) {
    if (req.session.passport) {
        return req.session.passport;
    }
}

router.get("/", passportStrat.authenticate("discord"));

router.get("/redirect", passportStrat.authenticate("discord"), (req, res) => {
    res.redirect("http://localhost:3000/guilds");
});

router.get("/status", async (req, res) => {
    if (isAuthenticated(req, res)) {
        console.log(req);
        res.json({
            id: getPassportSession(req, res).user,
            isAccessTokenValid: false, // add this later
            isRefreshTokenValid: false, // add this later
        });
    } else {
        res.sendStatus(403);
    }
})

export default router;
