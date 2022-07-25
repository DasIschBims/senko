import { EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "serverinfo",
    description: "Displays information about the server.",
    run: async ({ interaction }) => {

        var iconPNG = await interaction.guild.fetch().then(guild => guild.iconURL({ extension: "png", size: 4096 }));
        var iconJPG = await interaction.guild.fetch().then(guild => guild.iconURL({ extension: "jpg", size: 4096 }));
        var iconGIF = await interaction.guild.fetch().then(guild => guild.iconURL({ extension: "gif", size: 4096 }));
        var iconString = "[Link (PNG 4096x)](" + iconPNG + ")\n[Link (JPG 4096x)](" + iconJPG + ")\n[Link (GIF 4096x)](" + iconGIF + ")";

        var bannerPNG = await interaction.guild.fetch().then(guild => guild.bannerURL({ extension: "png", size: 4096 }));
        var bannerJPG = await interaction.guild.fetch().then(guild => guild.bannerURL({ extension: "jpg", size: 4096 }));
        var bannerGIF = await interaction.guild.fetch().then(guild => guild.bannerURL({ extension: "gif", size: 4096 }));
        var bannerString = "[Link (PNG 4096x)](" + bannerPNG + ")\n[Link (JPG 4096x)](" + bannerJPG + ")\n[Link (GIF 4096x)](" + bannerGIF + ")";
        if (bannerPNG == null && bannerJPG == null && bannerGIF == null) {
           bannerString = "This server has no banner set.";
        }

        var splashPNG = await interaction.guild.fetch().then(guild => guild.splashURL({ extension: "png", size: 4096 }));
        var splashJPG = await interaction.guild.fetch().then(guild => guild.splashURL({ extension: "jpg", size: 4096 }));
        var splashGIF = await interaction.guild.fetch().then(guild => guild.splashURL({ extension: "gif", size: 4096 }));
        var splashString = "[Link (PNG 4096x)](" + splashPNG + ")\n[Link (JPG 4096x)](" + splashJPG + ")\n[Link (GIF 4096x)](" + splashGIF + ")";
        if (splashPNG == null && splashJPG == null && splashGIF == null) {
              splashString = "This server has no discovery splash set.";
        }

        var emojiString: string;
        if (interaction.guild.emojis.cache.size > 0) {
            emojiString = interaction.guild.emojis.cache.map(emoji => emoji.toString()).join(", ");
            if (interaction.guild.emojis.cache.size > 25) {
                emojiString += `... ${interaction.guild.emojis.cache.size - 25} more`;
            }
        } else {
            emojiString = "No emojis in this guild.";
        }

        var boostString: string;
        if (interaction.guild.premiumTier > 0) {
            boostString = `Level: ${interaction.guild.premiumTier} <a:nitroboost:874899082613768222>`;
        }
        else {
            boostString = "This guild is not boosted.";
        }

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#${process.env.embedColor}`)
                    .setTimestamp()
                    .setAuthor({
                        name: `Senko#5072`,
                        iconURL: interaction.guild.iconURL({ size: 2048, forceStatic: false }),
                    })

                    .setThumbnail(interaction.guild.iconURL({ size: 2048, forceStatic: false }))
                    .addFields([
                        {
                            name: "**ID**",
                            value: `${interaction.guild.id}`,
                            inline: true,
                        },
                        {
                            name: "**Name**",
                            value: `${interaction.guild.name}`,
                            inline: true,
                        },
                        {
                            name: "**Owner**",
                            value: `<@${interaction.guild.ownerId}>`,
                            inline: true,
                        },
                        {
                            name: "**Members**",
                            value: `${interaction.guild.memberCount} members`,
                            inline: true,
                        },
                        {
                            name: "**Channels**",
                            value: `${interaction.guild.channels.cache.size}`,
                            inline: true,
                        },
                        {
                            name: "**Special Channels**",
                            value: `
                            AFK: ${interaction.guild.afkChannel ? interaction.guild.afkChannel.name : "None"}
                            System: ${interaction.guild.systemChannel ? interaction.guild.systemChannel.name : "None"}
                            Rules: ${interaction.guild.rulesChannel ? interaction.guild.rulesChannel.name : "None"}
                            Public Updates: ${interaction.guild.publicUpdatesChannel ? interaction.guild.publicUpdatesChannel.name : "None"}
                            `,
                            inline: true,
                        },
                        {
                            name: "**Boost Level**",
                            value: boostString,
                            inline: true,
                        },
                        {
                            name: "**Created At**",
                            value: `<t:${Math.round(interaction.guild.createdTimestamp / 1000)}>`,
                            inline: true,
                        },
                        {
                            name: "**Number of Bans**",
                            value: interaction.guild.bans.cache.size + " bans",
                            inline: true,
                        },
                        {
                            name: "**Icon**",
                            value: iconString,
                            inline: true,
                        },
                        {
                            name: "**Server Banner**",
                            value: bannerString,
                            inline: true,
                        },
                        {
                            name: "**Discovery Banner**",
                            value: splashString,
                            inline: true,
                        },
                        {
                            name: "**Roles**",
                            value: interaction.guild.roles.cache.map(role => role.toString()).join(", "),
                            inline: true,
                        },
                        {
                            name: "**Emojis**",
                            value: emojiString,
                            inline: true,
                        }
                    ])
            ]
        });
    }
});