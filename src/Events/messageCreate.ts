import { ChannelType } from "discord.js";
import { Event } from "../structures/Event";
import profileSchmea from "../schemas/profile";
import mongoose from "mongoose";
import { EmbedBuilder } from "discord.js";

export default new Event("messageCreate", async (message) => {
    if (message.channel.type !== ChannelType.GuildText) return;
    if (message.author.bot) return;

    const mongo = async () => await mongoose.connect(process.env.mongodbUri);

    // generate a function to get the next xp needed for a level
    const getNextXp = (level: number) => {
        return Math.floor(level * (level + 1) * 100);
    }

    await mongo().then(async (db) => {
        try {
            const profile = await profileSchmea.findOneAndUpdate({
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
                        $set: {
                            xp: profile.xp + Math.floor(Math.random() * 15) + 20,
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
                            .setTitle("You are now level " + profile.level + "! <a:catvibing:797159867966160946>")
                            .setImage("https://c.tenor.com/CqZZfYNz_mgAAAAC/senko-san-anime.gif")
                        ]
                    })
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            await db.disconnect();
        }
    }).catch((err) => {
        console.log(err);
    });
});