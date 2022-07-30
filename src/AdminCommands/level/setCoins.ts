import profileSchema from "../../schemas/profile"

module.exports = {
    execute(message, args) {
        if (args.length < 2) return;

        let userId;
        if (args[0] === "self") {
            userId = message.author.id;
        } else {
            userId = args[0]
        }

        let guildId;
        if (args[1] === "this") {
            guildId = message.guild.id;
        } else {
            guildId = args[1]
        }

        const coins = parseInt(args[2]);

        if (!userId || !guildId || !coins) return;

        async function setLevel(userId, guildId, coins) {
            const profile = await profileSchema.findOne({ userId, guildId });
            if (!profile) {
                message.react("❌");
            } else {
                profile.coins = coins;
                await profile.save();
                message.react("✅");
            }
        }

        setLevel(userId, guildId, coins);
    }
}
