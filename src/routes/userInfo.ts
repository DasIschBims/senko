import express from "express";
const router = express.Router();
import { client } from "../index";
import profileSchmea from "../schemas/profile";
import mongoose from "mongoose";

const getNextXp = (level: number) => {
    return Math.floor(level * (level + 1) * 100);
}

router.get("/:guildId/:userId", async (req, res) => {
    const mongo = async () => await mongoose.connect(process.env.mongodbUri);

    await mongo().then(async (db) => {
        try {
            const profile = await profileSchmea.findOne({
                guildId: req.params.guildId,
                userId: req.params.userId,
            });
            if (!profile) {
                res.status(404);
                res.json({ error: "Not found" });
                return;
            } else {
                res.status(200);
                const userAvatar = (await client.users.fetch(req.params.userId)).avatarURL({ size: 1024 });
                const username = (await client.users.fetch(req.params.userId)).username;
                const discriminator = (await client.users.fetch(req.params.userId)).discriminator;
                res.json({
                    xp: profile.xp,
                    xpRequired: getNextXp(profile.level),
                    level: profile.level,
                    username: username,
                    discriminator: discriminator,
                    avatarURL: userAvatar,
                });
                return;
            }
        } catch (err) {
            res.status(500);
            res.json({ error: "An error occurred" });
            return;
        } finally {
            db.disconnect();
        }
    })
});

export default router;
