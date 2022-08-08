import { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior } from "@discordjs/voice";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import ytdl from "ytdl-core";
import { Command } from "../../structures/Command";
import fs from "fs";
import { join } from "path";

export default new Command({
    name: "play",
    description: "Plays a song in your voice channel",
    options: [
        {
            name: "query",
            description: "The song to play",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async ({ interaction }) => {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setDescription("You need to be in a voice channel to use this command")
                    .setColor(`#${process.env.embedColor}`)
                    .setTimestamp()
            ]
        });

        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has("Connect") || !permissions.has("Speak")) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setDescription("I don't have permissions to join your voice channel")
                    .setColor(`#${process.env.embedColor}`)
                    .setTimestamp()
            ]
        });

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        if (!connection) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setDescription("I couldn't connect to your voice channel")
                    .setColor(`#${process.env.embedColor}`)
                    .setTimestamp()
            ]
        });

        const audioPlayer = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            },
            debug: true
        });

        const query = String(interaction.options.get("query").value);
        const urlFilter = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        if (urlFilter.test(query)) {
            const url = query;
            const validated = ytdl.validateURL(url);
            if (!validated) return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Invalid URL")
                        .setColor(`#${process.env.embedColor}`)
                        .setTimestamp()
                ]
            });

            connection.subscribe(audioPlayer);
        } else {
            return
        }
    }
});