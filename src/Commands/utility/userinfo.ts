import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import { client } from "../..";

export default new Command({
    name: "userinfo",
    description: "Displays information about specific user... or yourself if no user is specified.",
    options: [
        {
            name: "user",
            description: "The user to get information about",
            type: ApplicationCommandOptionType.User,
            required: false,
        }
    ],
    run: async ({ interaction }) => {
        const selected = interaction.options.get("user") || interaction.member;

        var userId = selected.user.id;
        var userMention = selected.user.toString();
        var userName = selected.user.username;
        var userDiscriminator = selected.user.discriminator;
        var userRoles = client.guilds.cache.get(interaction.guild.id).members.cache.get(userId).roles.cache.map(role => role.toString()).join(", ");
        var userNickname = client.guilds.cache.get(interaction.guild.id).members.cache.get(userId).nickname;
        var userCreatedAt = `<t:${Math.round(selected.user.createdTimestamp / 1000)}:D>`;
        var userJoinedAt = `<t:${Math.round(client.guilds.cache.get(interaction.guild.id).members.cache.get(userId).joinedTimestamp / 1000)}:D>`;
        var userAvatarPNG = await selected.user.fetch().then(user => user.avatarURL({ extension: "png", size: 4096 }));
        var userAvatarJPG = await selected.user.fetch().then(user => user.avatarURL({ extension: "jpg", size: 4096 }));
        var userAvatarGIF = await selected.user.fetch().then(user => user.avatarURL({ extension: "gif", size: 4096 }));
        var userBannerPNG = await selected.user.fetch().then(user => user.bannerURL({ extension: "png", size: 4096 }));
        var userBannerJPG = await selected.user.fetch().then(user => user.bannerURL({ extension: "jpg", size: 4096 }));
        var userBannerGIF = await selected.user.fetch().then(user => user.bannerURL({ extension: "gif", size: 4096 }));
        var bannerColor = await selected.user.fetch().then(user => user.hexAccentColor);

        var bannerString;
        if (userBannerPNG && userBannerJPG && userBannerGIF) {
            bannerString = `[Link (PNG 4096x)](${userBannerPNG})\n[Link (JPG 4096x)](${userBannerJPG})\n[Link (GIF 4096x)](${userBannerGIF})`;
        } else {
            if (bannerColor) {
                bannerString = `Banner color: ${bannerColor}`;
            } else {
                bannerString = "User didn't set a custom banner or custom color.";
            }
        }

        var avatarString = `[Link (PNG 4096x)](${userAvatarPNG})\n[Link (JPG 4096x)](${userAvatarJPG})\n[Link (GIF 4096x)](${userAvatarGIF})`;

        if (!userNickname) userNickname = "User didn't set a nickname.";

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#${process.env.embedColor}`)
                    .setTimestamp()
                    .setAuthor({
                        name: `${userName}#${userDiscriminator}`,
                        iconURL: selected.user.avatarURL({ size: 2048, forceStatic: false }),
                    })
                    .setThumbnail(selected.user.avatarURL({ size: 2048, forceStatic: false }))
                    .addFields([
                        {
                            name: "**ID**",
                            value: userId,
                            inline: true,
                        },
                        {
                            name: "**Mention**",
                            value: userMention,
                            inline: true,
                        },
                        {
                            name: "**Roles**",
                            value: userRoles,
                            inline: true,
                        },
                        {
                            name: "**Nickname**",
                            value: userNickname,
                            inline: true,
                        },
                        {
                            name: "**Created at**",
                            value: userCreatedAt,
                            inline: true,
                        },
                        {
                            name: "**Joined at**",
                            value: userJoinedAt,
                            inline: true,
                        },
                        {
                            name: "**Avatar**",
                            value: avatarString,
                            inline: true,
                        },
                        {
                            name: "**Banner**",
                            value: bannerString,
                            inline: true,
                        }
                    ])
            ]
        });
    }
});