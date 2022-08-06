import mongoose from "mongoose";

const schema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    welcomeChannel: {
        type: String,
        default: null,
    },
    welcomeMessage: {
        type: String,
        default: "Welcome to the server, {user}! 🎉",
    },
    leaveChannel: {
        type: String,
        default: null,
    },
    leaveMessage: {
        type: String,
        default: "Goodbye, {user}! 👋",
    }
});

export default mongoose.model("serversettings", schema, "serversettings");