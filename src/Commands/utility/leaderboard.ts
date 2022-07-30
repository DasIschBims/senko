import { EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import profileSchema from "../../schemas/profile";

export default new Command({
    name: "leaderboard",
    description: "Get the top 10 users by level",
    run: async ({ interaction }) => {
        try {
            const profiles = await profileSchema.find({
                guildId: interaction.guild.id,
            }).sort({ level: -1, xp: -1 }).limit(10);

            const embed = new EmbedBuilder()
                .setColor(`#${process.env.embedColor}`)
                .setTitle("Leaderboard of " + interaction.guild.name)
                .setDescription(profiles.map((profile, index) => `**${index + 1}.** <@!${profile.userId}> **-> Level ${profile.level}**`).join("\n"));

            interaction.followUp({ embeds: [embed] });
        } catch (err) {
            console.log(err);
        }
    }
});
