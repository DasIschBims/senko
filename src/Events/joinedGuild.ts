import { Event } from "../structures/Event";
import settingSchema from "../schemas/serversettings";

export default new Event("guildCreate", (guild) => {
    settingSchema.findOne({ guildId: guild.id }, (err, settings) => {
        if (err) {
            console.log(err);
        } else if (!settings) {
            const newSettings = new settingSchema({
                guildId: guild.id,
            });
            newSettings.save();
        }
    });
});