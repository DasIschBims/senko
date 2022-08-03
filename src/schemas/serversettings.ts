import mongoose from "mongoose";

const schema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    welcomeChannel: {
        type: String,
        default: "none",
    },
    welcomeMessage: {
        type: String,
        default: "Welcome to the server, {user}! 🎉",
    },
    leaveChannel: {
        type: String,
        default: "none",
    },
    leaveMessage: {
        type: String,
        default: "Goodbye, {user}! 👋",
    }
});

export default mongoose.model("serversettings", schema, "serversettings");