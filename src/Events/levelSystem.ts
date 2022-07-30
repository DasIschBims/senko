import { ChannelType } from "discord.js";
import { Event } from "../structures/Event";
import profileSchmea from "../schemas/profile";
import { EmbedBuilder } from "discord.js";
import getNextXp from "../Utils/Level/GetNextXp";

const cooldowns = new Set();

export default new Event("messageCreate", async (message) => {
    if (message.channel.type !== ChannelType.GuildText) return;
    if (message.author.bot) return;

    if (cooldowns.has(message.author.id)) return;

    cooldowns.add(message.author.id);
    try {
        const profile = await profileSchmea.findOne({
            guildId: message.guild.id,
            userId: message.author.id,
        });

        if (!profile) {
            await profileSchmea.create({
                userId: message.author.id,
                guildId: message.guild.id,
            });
        } else {
            await profileSchmea.updateOne(
                {
                    userId: message.author.id,
                    guildId: message.guild.id,
                },
                {
                    $inc: {
                        xp: Math.floor(Math.random() * 15) + 10,
                    },
                }
            );

            if (profile.xp >= getNextXp(profile.level)) {
                const needed = getNextXp(profile.level);
                await profileSchmea.updateOne(
                    {
                        userId: message.author.id,
                        guildId: message.guild.id,
                    },
                    {
                        $set: {
                            xp: profile.xp - needed,
                            level: profile.level + 1,
                        },
                    }
                );
                message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${process.env.embedColor}`)
                            .setTimestamp()
                            .setTitle("You are now level " + (profile.level + 1) + "! 🎉")
                            .setImage("https://c.tenor.com/CqZZfYNz_mgAAAAC/senko-san-anime.gif")
                    ]
                })
            }
        }
    } catch (err) {
        console.log(err);
    }

    setTimeout(() => {
        cooldowns.delete(message.author.id);
    }, 60000);
});
