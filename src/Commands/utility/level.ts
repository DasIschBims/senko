import { EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../structures/Command";
import profileSchema from "../../schemas/profile";
import mongoose from "mongoose";
import { client } from "../..";

export default new Command({
    name: "level",
    description: "Get your current level and XP",
    options: [
        {
            name: "user",
            description: "Get the level of another user",
            type: ApplicationCommandOptionType.User,
            required: false,
        }
    ],
    run: async ({ interaction }) => {
        const mongo = async () => await mongoose.connect(process.env.mongodbUri);

        await mongo().then(async (db) => {
            try {
                var profile;
                if (interaction.options.get("user")) {
                    const user = interaction.options.get("user");
                    profile = await profileSchema.findOne({
                        userId: user.user.id,
                        guildId: interaction.guild.id,
                    });
                } else {
                    profile = await profileSchema.findOne({
                        guildId: interaction.guild.id,
                        userId: interaction.user.id,
                    });
                }

                if (!profile) {
                    await profileSchema.create({
                        userId: interaction.user.id,
                        guildId: interaction.guild.id,
                    });
                    if (interaction.options.get("user")) {
                        const user = interaction.options.get("user");
                        return interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`#${process.env.embedColor}`)
                                    .setAuthor({
                                        name: `${user.user.username}#${user.user.discriminator}`,
                                        iconURL: user.user.avatarURL({ size: 2048, forceStatic: false }),
                                    })
                                    .setDescription("This user has no profile yet.")
                            ]
                        })
                    } else {
                        return interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`#${process.env.embedColor}`)
                                    .setAuthor({
                                        name: `${interaction.user.username}#${interaction.user.discriminator}`,
                                        iconURL: interaction.user.avatarURL({ size: 2048, forceStatic: false }),
                                    })
                                    .setDescription("You didn't have a profile yet, so I created one for you.")
                            ]
                        })
                    }
                }

                if (interaction.options.get("user")) {
                    const user = interaction.options.get("user");
                    interaction.followUp({ embeds: [
                        new EmbedBuilder()
                        .setColor(`#${process.env.embedColor}`)
                        .setTimestamp()
                        .setAuthor({
                            name: `${user.user.username}#${user.user.discriminator}`,
                            iconURL: user.user.avatarURL({ size: 2048, forceStatic: false }),
                        })
                        .setDescription(`**Level ${profile.level}**\n${profile.xp}/${profile.level * (profile.level + 1) * 100} XP`)
                    ]});
                } else {
                    interaction.followUp({ embeds: [
                        new EmbedBuilder()
                        .setColor(`#${process.env.embedColor}`)
                        .setTimestamp()
                        .setAuthor({
                            name: `${interaction.user.username}#${interaction.user.discriminator}`,
                            iconURL: interaction.user.avatarURL({ size: 2048, forceStatic: false }),
                        })
                        .setDescription(`**Level ${profile.level}**\n${profile.xp}/${profile.level * (profile.level + 1) * 100} XP`)
                        .setFooter({ text: "Tip: You can also look up your level on the [Website](https://senko.dasischbims.social/).", iconURL: client.user.avatarURL({ size: 2048, forceStatic: false }) })
                    ]});
                }
            } catch (err) {
                console.log(err);
            } finally {
                await mongoose.disconnect();
            }
        }).catch(err => console.log(err));
    }
});