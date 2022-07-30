import { client } from "..";
import { Event } from "../structures/Event";

const adminPrefix = process.env.adminPrefix;

export default new Event("messageCreate", (message) => {
    if (!message.content.startsWith(adminPrefix + " ") || message.author.bot) return;
    if (message.author.id !== process.env.adminId) return;

    const args = message.content.slice(adminPrefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "setlevel") {
        const setlevel = require("../AdminCommands/level/setLevel");
        setlevel.execute(message, args);
    }

    if (command === "setxp") {
        const setxp = require("../AdminCommands/level/setXp");
        setxp.execute(message, args);
    }

    if (command === "setcoins") {
        const setcoins = require("../AdminCommands/level/setCoins");
        setcoins.execute(message, args);
    }
});