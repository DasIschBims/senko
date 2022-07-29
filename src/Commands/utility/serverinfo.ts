import { EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "serverinfo",
    description: "Displays information about the server.",
    run: async ({ interaction }) => {

        let iconPNG = await interaction.guild.fetch().then(guild => guild.iconURL({ extension: "png", size: 4096 }));
        let iconJPG = await interaction.guild.fetch().then(guild => guild.iconURL({ extension: "jpg", size: 4096 }));
        let iconGIF = await interaction.guild.fetch().then(guild => guild.iconURL({ extension: "gif", size: 4096 }));
        let iconString = "[Link (PNG 4096x)](" + iconPNG + ")\n[Link (JPG 4096x)](" + iconJPG + ")\n[Link (GIF 4096x)](" + iconGIF + ")";

        let bannerPNG = await interaction.guild.fetch().then(guild => guild.bannerURL({ extension: "png", size: 4096 }));
        let bannerJPG = await interaction.guild.fetch().then(guild => guild.bannerURL({ extension: "jpg", size: 4096 }));
        let bannerGIF = await interaction.guild.fetch().then(guild => guild.bannerURL({ extension: "gif", size: 4096 }));
        let bannerString = "[Link (PNG 4096x)](" + bannerPNG + ")\n[Link (JPG 4096x)](" + bannerJPG + ")\n[Link (GIF 4096x)](" + bannerGIF + ")";
        if (!bannerPNG && !bannerJPG && !bannerGIF) {
           bannerString = "This server has no banner set.";
        }

        let splashPNG = await interaction.guild.fetch().then(guild => guild.splashURL({ extension: "png", size: 4096 }));
        let splashJPG = await interaction.guild.fetch().then(guild => guild.splashURL({ extension: "jpg", size: 4096 }));
        let splashString = "[Link (PNG 4096x)](" + splashPNG + ")\n[Link (JPG 4096x)](" + splashJPG + ")";
        if (!splashPNG && !splashJPG) {
              splashString = "This server has no splash image set.";
        }

        let emojiString: string;
        if (interaction.guild.emojis.cache.size > 10) {
            emojiString = interaction.guild.emojis.cache.map(e => e.toString()).slice(0, 10).join(", ") + " ... " + (interaction.guild.emojis.cache.size - 10) + " more.";
        } else if (interaction.guild.emojis.cache.size == 0 || interaction.guild.emojis.cache.size == undefined) {
            emojiString = "This server has no emojis added.";
        } else if (interaction.guild.emojis.cache.size <= 10) {
            emojiString = interaction.guild.emojis.cache.map(e => e.toString()).join(", ");
        }

        let boostString: string;
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
                            name: "**Multi Factor Authentication**",
                            value: `${interaction.guild.mfaLevel ? "Enabled" : "Disabled"}`,
                            inline: true,
                        },
                        {
                            name: "**Partnered**",
                            value: `${interaction.guild.partnered ? "Yes" : "No"}`,
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