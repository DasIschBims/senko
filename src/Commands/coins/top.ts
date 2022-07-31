import { EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import profileSchema from "../../schemas/profile";

export default new Command({
    name: "top",
    description: "Get the top 10 users with the most coins",
    run: async ({ interaction }) => {
        try {
            const profiles = await profileSchema.find({
                guildId: interaction.guild.id,
            }).sort({ coins: -1 }).limit(10);

            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#${process.env.embedColor}`)
                        .setAuthor({
                            name: "Top 10 Users by Coins",
                            iconURL: interaction.guild.iconURL({ size: 2048, forceStatic: false }),
                        })
                        .setDescription(profiles.map((profile, index) => `**${index + 1}.** <@!${profile.userId}> **-> ${profile.coins}** 🪙`).join("\n")),
                ]
            });
        } catch (err) {
            console.log(err);
        }
    }
});
