import { EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import profileSchema from "../../schemas/profile";
import mongoose from "mongoose";

export default new Command({
    name: "level",
    description: "Get your current level and XP",
    run: async ({ interaction }) => {
        const mongo = async () => await mongoose.connect(process.env.mongodbUri);

        await mongo().then(async (db) => {
            try {
                const profile = await profileSchema.findOne({
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                })

                interaction.followUp({ embeds: [
                    new EmbedBuilder()
                    .setColor(`#${process.env.embedColor}`)
                    .setTimestamp()
                    .setAuthor({
                        name: `${interaction.user.username}#${interaction.user.discriminator}`,
                        iconURL: interaction.user.avatarURL({ size: 2048, forceStatic: false }),
                    })
                    .setDescription(`**Level ${profile.level}**\n${profile.xp}/${profile.level * (profile.level + 1) * 100} XP`)
                ]});
            } catch (err) {
                console.log(err);
            } finally {
                await mongoose.disconnect();
            }
        }).catch(err => console.log(err));
    }
});