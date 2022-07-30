import { EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../structures/Command";
import profileSchema from "../../schemas/profile";

export default new Command({
    name: "coins",
    description: "Get your current amount of coins",
    options: [
        {
            name: "user",
            description: "Get the amout of coins of another user",
            type: ApplicationCommandOptionType.User,
            required: false,
        }
    ],
    run: async ({ interaction }) => {
        try {
            let profile;
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
                interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${process.env.embedColor}`)
                            .setTimestamp()
                            .setAuthor({
                                name: `${user.user.username}#${user.user.discriminator}`,
                                iconURL: user.user.avatarURL({ size: 2048, forceStatic: false }),
                            })
                            .setDescription(`**${user.user.username}** has **${profile.coins}** coins. 🪙\n__Please not that this system has not been implemented yet.__`)
                    ]
                });
            } else {
                interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${process.env.embedColor}`)
                            .setTimestamp()
                            .setAuthor({
                                name: `${interaction.user.username}#${interaction.user.discriminator}`,
                                iconURL: interaction.user.avatarURL({ size: 2048, forceStatic: false }),
                            })
                            .setDescription(`You have **${profile.coins}** coins. 🪙\n__Please not that this system has not been implemented yet.__`)
                    ]
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
});
