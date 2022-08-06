import { Event } from "../structures/Event";
import settingSchema from "../schemas/serversettings";
import { client } from "..";
import { ChannelType, EmbedBuilder } from "discord.js";

export default new Event("guildMemberRemove", async (event) => {
    const guild = event.guild;
    const member = event.user;
    try {
        const settings = await settingSchema.findOne({
            guildId: guild.id,
        });
        if (!settings) {
            return await settingSchema.create({
                guildId: guild.id
            });
        }

        if (!settings.leaveChannel) return;

        const channel = guild.channels.cache.get(settings.leaveChannel);
        if (!channel) return await settingSchema.updateOne({ guildId: guild.id }, { leaveChannel: null });
        if (client.guilds.cache.get(guild.id)?.channels.cache.get(channel.id).type !== ChannelType.GuildText) return;

        const leaveMessage = settings.leaveMessage.replace("{user}", member.username).replace("{guild}", guild.name).replace("{usermention}", `<@${member.id}>`);
        if (!leaveMessage) return;

        const leaveEmbed = new EmbedBuilder()
            .setColor(`#${process.env.embedColor}`)
            .setDescription(leaveMessage)
            .setTimestamp()
            .setAuthor({ name: member.username, iconURL: member.avatarURL({ extension: "png", size: 2048 }) })

        if (channel.type == ChannelType.GuildText) {
            channel.send({ embeds: [leaveEmbed] });
        }
    } catch (err) {
        console.log(err);
    }
});