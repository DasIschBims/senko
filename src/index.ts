require("dotenv").config();
import { MessageEmbed } from "discord.js";
import { ExtendedClient } from "./structures/Client";

const errorEmbed = new MessageEmbed()
.setColor("#635291")
.setTimestamp()
.addFields([
    {
        name: "An error occured",
        value: "Looks like you stumpled across a bug. Please report this to the developer.",
        inline: true,
    }
]);

// 

export const client = new ExtendedClient();
export const ErrorEmbed = errorEmbed;

client.start();

// help, i don't know how to add options to slash commands .-.
// nvmd i found out, just needed an array instead of an object for the options