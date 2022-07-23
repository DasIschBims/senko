import { CommandInteractionOptionResolver } from "discord.js";
import { client, ErrorEmbed } from "..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";

const errorEmbed = ErrorEmbed;

export default new Event("interactionCreate", async (interaction) => {
    if(interaction.isCommand()) {
        await interaction.deferReply();
        const command = client.commands.get(interaction.commandName);
        if(command) {
            return command.run({
                args: interaction.options as CommandInteractionOptionResolver,
                client,
                interaction: interaction as ExtendedInteraction
            });
        } else if (interaction.isButton()) {
            return console.log("Button\n" + interaction);
        } else {
            return interaction.followUp({ embeds: [errorEmbed], ephemeral: true});
        }
    }
});