import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, GatewayIntentBits, Partials } from "discord.js";
import { CommandType } from "../typings/Command";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/Client";
import { Event } from "./Event";
import express from "express";
import bodyParser from "body-parser";
import botInfo from "../routes/botInfo";
import mongoose from "mongoose";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    buttons: Collection<any, any>;

    constructor() {
        super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages], partials: [Partials.Message, Partials.User, Partials.GuildMember] });
    }

    async start() {
        this.registerModules();
        this.express();
        this.mongodb();
        this.login(process.env.botToken);
    }

    express() {
        const app = express();
        const port = 8000;
        app.use(bodyParser.json());
        app.use("/senko/api/info", botInfo);

        app.listen(port, () => console.log(`Express is now listening on port ${port}`));
    }

    async mongodb() {
        await mongoose.connect(process.env.mongodbUri, {
            keepAlive: true,
        }).then(() => {
            console.log("Connected to MongoDB");
        }).catch((err) => {
            console.log(err);
        });
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }
    
    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log("Registered commands for guild:", guildId);
        } else {
            this.application?.commands.set(commands);
            console.log("Registered commands for application:", this.application?.id);
        }
    }

    async registerModules() {
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await globPromise(
            `${__dirname}/../commands/*/*{.ts,.js}`
        );
        commandFiles.forEach(async (filePath) => {
            const command: CommandType = await this.importFile(filePath);
            if (!command.name) return;

            this.commands.set(command.name, command);
            slashCommands.push(command);
        });

        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.guildId
            });
        });

        const eventFiles = await globPromise(
            `${__dirname}/../events/*{.ts,.js}`
        );
        eventFiles.forEach(async (filePath) => {
            const event: Event<keyof ClientEvents> = await this.importFile(
                filePath
            );
            this.on(event.event, event.run);
        });
    }
}