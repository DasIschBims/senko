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
import cors from "cors";
import https from "https";
import fs from "fs";
import path from "path";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();

    constructor() {
        super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages], partials: [Partials.Message, Partials.User, Partials.GuildMember] });
    }

    start() {
        this.registerModules();
        this.express();
        this.mongodb();
        this.login(process.env.botToken);
    }

    express() {
        const app = express();

        if (process.env.port) {
            var port = Number(process.env.port);
        } else {
            var port = 8000;
        }

        app.use(cors());
        app.use(bodyParser.json());
        app.use("/senko/api/info", botInfo);

        app.get("/css/style.css", function(req, res) {
            res.sendFile(path.resolve(__dirname + "../../../css/style.css"));
        });

        app.get("/js/index.js", function(req, res) {
            res.sendFile(path.resolve(__dirname + "../../../js/index.js"));
        });

        app.get("/img/favicon.ico", function(req, res) {
            res.sendFile(path.resolve(__dirname + "../../../img/favicon.ico"));
        });

        app.use(function(req, res) {     
           if (req.accepts("html")) {
              res.sendFile(path.resolve(__dirname + "../../../index.html"));
              return;
           }

           if (req.accepts("json")) {
              res.json({ error: "Not found" });
              return;
           }
        });

        https.createServer(
            {
                key: fs.readFileSync(process.env.key),
                cert: fs.readFileSync(process.env.cert)
            },
            app
        )
        .listen(port, function () {
            console.log("Express is now listening over https on port " + port);
        });
    }

    async mongodb() {
        if (process.env.mongodbUri) {
            await mongoose.connect(process.env.mongodbUri, {
                keepAlive: true,
            }).then(() => {
                console.log("Connected to MongoDB");
            }).catch((err) => {
                console.log(err);
            });
        } else {
            console.log("No MongoDB URI provided");
        }
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
            `${__dirname}/../Commands/*/*{.ts,.js}`
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
            `${__dirname}/../Events/*{.ts,.js}`
        );
        eventFiles.forEach(async (filePath) => {
            const event: Event<keyof ClientEvents> = await this.importFile(
                filePath
            );
            this.on(event.event, event.run);
        });
    }
}
