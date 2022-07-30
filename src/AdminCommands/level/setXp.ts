import profileSchema from "../../schemas/profile"

module.exports = {
    execute(message, args) {
        if (args.length < 2) return;

        let userId;
        if (args[0] === "self") {
            userId = message.author.id;
        }

        let guildId;
        if (args[1] === "this") {
            guildId = message.guild.id;
        }

        const xp = parseInt(args[2]);

        if (!userId || !guildId || !xp) return;

        async function setLevel(userId, guildId, xp) {
            const profile = await profileSchema.findOne({ userId, guildId });
            if (!profile) {
                message.react("❌");
            } else {
                profile.xp = xp;
                await profile.save();
                message.react("✅");
            }
        }

        setLevel(userId, guildId, xp);
    }
}