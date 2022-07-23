import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "ping",
    description: "Displays the bot's latency",
    run: async ({ interaction }) => {
        interaction.followUp({ embeds: [
            new MessageEmbed()
            .setColor(`#${process.env.embedColor}`)
            .setTimestamp()
            .addFields([
                {
                    name: "Pong! 🏓",
                    value: `Ping: **${Date.now() - interaction.createdTimestamp}ms**\nAPI-Latency: **${Math.round(interaction.client.ws.ping)}ms**`,
                    inline: true,
                  }
            ])
        ]});
    }
});