import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import settingsSchema from "../../schemas/serversettings";

export default new Command({
    name: "config",
    description: "Manage the server's configuration for the bot.",
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
                type: ApplicationCommandOptionType.Channel,
                required: true,
            }, {
                name: "message",
                description: "Set the welcome message.",
                type: ApplicationCommandOptionType.String,
                required: true,
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
                type: ApplicationCommandOptionType.Channel,
                required: true,
            }, {
                name: "message",
                description: "Set the leave message.",
                type: ApplicationCommandOptionType.String,
                required: true,
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
            if (!interaction.member.permissions.has("Administrator")) return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("**You do not have permission to use this command.**")
                        .setColor("#ff0000")
                        .setFooter({ text: "You need Administrator permissions to use this command." })
                ]
            })

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

            if (interaction.options.getSubcommandGroup() === "welcome-messages") {
                if (interaction.options.getSubcommand() === "set") {
                    if (interaction.options.getChannel("channel") && interaction.options.getString("message")) {
                        await settings.updateOne({
                            welcomeChannel: interaction.options.getChannel("channel").id,
                            welcomeMessage: interaction.options.getString("message"),
                        });
                        await settings.save();
                        return interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Configuration")
                                    .setDescription("Welcome message and channel set.")
                                    .setColor(`#${process.env.embedColor}`)
                            ]
                        })
                    }
                } else if (interaction.options.getSubcommand() === "clear") {
                    await settings.updateOne({
                        welcomeChannel: "none",
                        welcomeMessage: "none",
                    });
                    await settings.save();
                    return interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Configuration")
                                .setDescription("Welcome messagea and channel cleared.")
                                .setColor(`#${process.env.embedColor}`)
                        ]
                    })
                }
            }

            if (interaction.options.getSubcommandGroup() === "leave-messages") {
                if (interaction.options.getSubcommand() === "set") {
                    if (interaction.options.getChannel("channel") && interaction.options.getString("message")) {
                        await settings.updateOne({
                            leaveChannel: interaction.options.getChannel("channel").id,
                            leaveMessage: interaction.options.getString("message"),
                        });
                        await settings.save();
                        return interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Configuration")
                                    .setDescription("Leave message and channel set.")
                                    .setColor(`#${process.env.embedColor}`)
                            ]
                        })
                    }
                } else if (interaction.options.getSubcommand() === "clear") {
                    await settings.updateOne({
                        leaveChannel: "none",
                        leaveMessage: "none",
                    });
                    await settings.save();
                    return interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Configuration")
                                .setDescription("Leave message and channel cleared.")
                                .setColor(`#${process.env.embedColor}`)
                        ]
                    })
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
});
