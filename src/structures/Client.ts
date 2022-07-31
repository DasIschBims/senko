import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, GatewayIntentBits, Partials } from "discord.js";
import { CommandType } from "../typings/Command";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/Client";
import { Event } from "./Event";
import express from "express";
import bodyParser from "body-parser";
import botInfo from "../routes/botInfo";
import userInfo from "../routes/userInfo";
import mongoose from "mongoose";
import cors from "cors";
import https from "https";
import fs from "fs";
import path from "path";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { Command } from "./Command";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();

    constructor() {
        super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], partials: [Partials.Message, Partials.User, Partials.GuildMember] });
    }

    start() {
        this.registerModules();
        this.express();
        this.mongodb();
        this.login(process.env.botToken);
    }

    express() {
        const app = express();

        let port: number;

        if (process.env.port) {
            port = Number(process.env.port);
        } else {
            port = 8000;
        }

        app.use(cors());
        app.use(bodyParser.json());

        const apiLimitInfos = rateLimit({
            windowMs: 3 * 60 * 1000,
            max: 20
        })

        const apiSpeedLimitInfos = slowDown({
            windowMs: 3 * 60 * 1000,
            delayAfter: 12,
            delayMs: 50
        });

        const apiLimitUsers = rateLimit({
            windowMs: 5 * 60 * 1000,
            max: 20
        });

        const apiSpeedLimitUsers = slowDown({
            windowMs: 5 * 60 * 1000,
            delayAfter: 5,
            delayMs: 100
        });

        const imageSpeedLimit = slowDown({
            windowMs: 1 * 60 * 1000,
            delayAfter: 5,
            delayMs: 20,
            maxDelayMs: 400
        });


        app.get("/", function (req, res) {
            res.sendFile(path.resolve(__dirname + "../../../website/index.html"))
        });
        app.get("/css/style.css", function (req, res) {
            res.sendFile(path.resolve(__dirname + "../../../website/css/style.css"));
        });
        app.get("/js/index.js", function (req, res) {
            res.sendFile(path.resolve(__dirname + "../../../website/js/index.js"));
        });
        app.get("/img/favicon.ico", function (req, res) {
            res.sendFile(path.resolve(__dirname + "../../../website/img/favicon.ico"));
        });
        app.get("/levelchart.png", function (req, res) {
            res.sendFile(path.resolve(__dirname + "../../images/levelchart.png"));
        });

        app.use("/levelchart.png", imageSpeedLimit);
        app.use("/api/infos", apiLimitInfos, apiSpeedLimitInfos, botInfo);
        app.use("/api/users", apiLimitUsers, apiSpeedLimitUsers, userInfo);

        app.all("*", function (req, res) {
            res.status(404)
            res.redirect("/")
        })

        app.use(function (req, res) {
            res.status(404)
            res.json({ error: "Not found" });
        });

        if (process.env.NODE_ENV === "prod") {
            const keypath = path.resolve(process.env.key)
            const certpath = path.resolve(process.env.cert)

            https.createServer(
                {
                    key: fs.readFileSync(keypath),
                    cert: fs.readFileSync(certpath)
                },
                app
            )
                .listen(port, function () {
                    console.log("Express is now listening over https on port " + port);
                });
        } else {
            app.listen(port, function () {
                console.log("Express is now listening over http on port " + port);
            });
        }
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
