import { CommandInteractionOptionResolver, InteractionType } from "discord.js";
import { client, ErrorEmbed } from "..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";

const errorEmbed = ErrorEmbed;

export default new Event("interactionCreate", async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        await interaction.deferReply();
        const command = client.commands.get(interaction.commandName);
        if (command) {
            return command.run({
                args: interaction.options as CommandInteractionOptionResolver,
                client,
                interaction: interaction as ExtendedInteraction
            }).catch((e: any) => {
                console.error(e);
                return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
            });
        }
    }
});