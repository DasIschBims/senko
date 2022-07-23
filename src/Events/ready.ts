import { Event } from "../structures/Event";
import { client } from "../index";
import mongoose from "mongoose";

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


    // Connect to MongoDB
    await mongoose.connect(process.env.mongodbUri, {
        keepAlive: true,
    }).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.log(err);
    });
});