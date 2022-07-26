import { Event } from "../structures/Event";
import { client } from "../index";

export default new Event("ready", () => {
    console.log("Logged in as:", client.user?.tag);

    const activityList = [
        { type: 3, message: `${client.guilds.cache.size} servers` },
        { type: 2, message: `${client.users.cache.size} users` },
    ];

    var state: number = 0;

    setInterval(() => {
        state = (state + 1) % activityList.length;

        const activity = activityList[state];

        client.user.setActivity(activity.message, { type: activity.type });
    }, 10000);
});