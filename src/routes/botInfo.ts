import express from "express";
const router = express.Router();
import { client } from "../index";

router.get("/", (req, res) => {
    
    res.json({
        guildCount: client.guilds.cache.size,
        userCount: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0 - 1),
        commands: client.commands.size,
        uptime: client.uptime,
    });
});

export default router;
