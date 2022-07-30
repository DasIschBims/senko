import express from "express";
const router = express.Router();
import { client } from "../index";
import profileSchmea from "../schemas/profile";

const getNextXp = (level: number) => {
    return Math.floor(10*(level ^ 2) + (55 * level) + 100);
}

router.get("/:guildId/:userId", async (req, res) => {
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
        }
});

export default router;
