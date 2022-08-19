import express from "express";
import passportStrat from "../strategies/discord";
const router = express.Router();

router.get("/", passportStrat.authenticate("discord"), (req, res) => {
    res.sendStatus(200);
});

router.get("/redirect", passportStrat.authenticate("discord"), (req, res) => {
    res.sendStatus(200);
})

export default router;
