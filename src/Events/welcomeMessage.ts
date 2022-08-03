import { Event } from "../structures/Event";
import settingSchema from "../schemas/serversettings";
import { client } from "..";
import { ChannelType, EmbedBuilder } from "discord.js";

export default new Event("guildMemberAdd", async (event) => {
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

        if (settings.welcomeChannel == "none") return;

        const channel = guild.channels.cache.get(settings.welcomeChannel);
        if (!channel) return;
        if (client.guilds.cache.get(guild.id)?.channels.cache.get(channel.id).type !== ChannelType.GuildText) return;

        const welcomeMessage = settings.welcomeMessage.replace("{user}", member.username).replace("{guild}", guild.name).replace("{usermention}", `<@${member.id}>`);
        if (!welcomeMessage) return;

        const welcomeEmbed = new EmbedBuilder()
            .setColor(`#${process.env.embedColor}`)
            .setDescription(welcomeMessage)
            .setTimestamp()
            .setAuthor({ name: member.username, iconURL: member.avatarURL({ extension: "png", size: 2048 }) })

        if (channel.type == ChannelType.GuildText) {
            channel.send({ embeds: [welcomeEmbed] });
        }
    } catch (err) {
        console.log(err);
    }
});