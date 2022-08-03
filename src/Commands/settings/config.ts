import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import settingsSchema from "../../schemas/serversettings";

export default new Command({
    name: "config",
    description: "Manage the server's configuration for the bot.",
    userPermissions: ["Administrator"],
    options: [{
        name: "welcome-messages",
        description: "Manage the welcome messages.",
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: [{
            name: "set",
            description: "Set the welcome messages.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "channel",
                description: "Set the channel to send the welcome messages to.",
                type: ApplicationCommandOptionType.String,
            }, {
                name: "message",
                description: "Set the welcome message.",
                type: ApplicationCommandOptionType.String,
            }],
        },
        {
            name: "clear",
            description: "Clear the welcome messages.",
            type: ApplicationCommandOptionType.Subcommand,
        }]
    },
    {
        name: "leave-messages",
        description: "Manage the leave messages.",
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: [{
            name: "set",
            description: "Set the leave messages.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "channel",
                description: "Set the channel to send the leave messages to.",
                type: ApplicationCommandOptionType.String,
            }, {
                name: "message",
                description: "Set the leave message.",
                type: ApplicationCommandOptionType.String,
            }],
        },
        {
            name: "clear",
            description: "Clear the leave messages.",
            type: ApplicationCommandOptionType.Subcommand,
        }],
    }],
    run: async ({ interaction }) => {
        try {
            const settings = await settingsSchema.findOne({
                guildId: interaction.guild.id,
            });
            if (!settings) {
                await settingsSchema.create({
                    guildId: interaction.guild.id,
                });
                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Configuration")
                            .setDescription("No configuration found. Created a new one in the database.")
                            .setColor(`#${process.env.embedColor}`)
                    ]
                })
            }

            const welcomeMessage = settings.welcomeMessage;
            const leaveMessage = settings.leaveMessage;
            const welcomeChannel = settings.welcomeChannel;
            const leaveChannel = settings.leaveChannel;


        } catch (err) {
            console.log(err);
        }
    }
});
