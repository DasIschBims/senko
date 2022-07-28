require("dotenv").config();
import { EmbedBuilder } from "discord.js";
import { ExtendedClient } from "./structures/Client";

const errorEmbed = new EmbedBuilder()
.setColor("#ffffff")
.addFields([
    {
        name: "An error occured",
        value: "Looks like you stumpled across a bug. Please report this to the developer.",
        inline: true,
    }
]);


export const client = new ExtendedClient();
export const ErrorEmbed = errorEmbed;

client.start();