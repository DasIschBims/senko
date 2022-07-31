import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import profileSchema from "../../schemas/profile";

export default new Command({
    name: "pay",
    description: "Pay your coins to someone else",
    options: [
        {
            name: "user",
            description: "The user to pay coins to",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "amount",
            description: "The amount of coins to pay",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],
    run: async ({ interaction }) => {
        try {
            const user = interaction.options.get("user");
            const userProfile = await profileSchema.findOne({
                userId: user.user.id,
                guildId: interaction.guild.id,
            });
            const ownProfile = await profileSchema.findOne({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
            });
            const amount = interaction.options.get("amount");

            if (interaction.user.id === user.user.id) {
                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${process.env.embedColor}`)
                            .setDescription("You can't pay yourself coins."),
                    ]
                });
            }

            if (user.user.bot) {
                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${process.env.embedColor}`)
                            .setDescription("You can't pay coins to a bot."),
                    ]
                });
            }

            if (!userProfile) {
                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${process.env.embedColor}`)
                            .setDescription(`**${user.user.username}** has no profile in this guild yet.`),
                    ]
                });
            }

            if (!ownProfile) {
                await profileSchema.create({
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                });

                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${process.env.embedColor}`)
                            .setDescription("You didn't have a profile yet, so I created one for you."),
                    ]
                });
            }

            if (ownProfile.coins < amount.value) {
                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${process.env.embedColor}`)
                            .setDescription(`You don't have enough coins to pay **${amount.value} 🪙** to **${user.user.username}**.`),
                    ]
                });
            }

            await profileSchema.updateOne(
                {
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                },
                {
                    $set: {
                        coins: ownProfile.coins - Number(amount.value),
                    },
                }
            );

            await profileSchema.updateOne(
                {
                    userId: user.user.id,
                    guildId: interaction.guild.id,
                },
                {
                    $set: {
                        coins: userProfile.coins + Number(amount.value),
                    },
                }
            );

            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#${process.env.embedColor}`)
                        .setDescription(`You paid **${amount.value} 🪙** coins to **${user.user.username}**.`),
                ]
            });
        } catch (err) {
            console.log(err);
        }
    }
});
