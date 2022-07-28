import { EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import levelchart from "../../images/levelchart.png"

export default new Command({
    name: "levelchart",
    description: "Get a chart on how the level system works.",
    run: async ({ interaction }) => {
        interaction.followUp({ embeds: [
            new EmbedBuilder()
            .setColor(`#${process.env.embedColor}`)
            .setTimestamp()
            .setTitle("Levelchart 📈")
            .setDescription("The function to calculate the xp needed for an level is as follows:\n``10 * (level ^ 2) + (55 * level) + 100``")
            .setImage(levelchart)
        ]});
    }
});