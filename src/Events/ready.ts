import { Event } from "../structures/Event";
import { client } from "../index";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";

export default new Event("ready", async () => {
    console.log("Logged in as:", client.user?.tag);

    const activityList = [
        { type: 3, message: `${client.guilds.cache.size} servers` },
        { type: 3, message: `${client.guilds.cache.size} servers` },
    ];

    var state: number = 0;

    setInterval(() => {
        state = (state + 1) % activityList.length;

        const activity = activityList[state];

        client.user?.setActivity(`${activity.message}`, { type: activity.type });
    }, 10000);

    // Setup express js to handle requests
    const app = express();
    const port = process.env.PORT || 6969;
    app.use(bodyParser.json());

    const botInfo = require("../routes/botinfo");
    app.use("/senko/api/info", botInfo);

    app.listen(port, () => console.log(`Listening on port ${port}`));


    // Connect to MongoDB
    await mongoose.connect(process.env.mongodbUri, {
        keepAlive: true,
    }).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.log(err);
    });
});