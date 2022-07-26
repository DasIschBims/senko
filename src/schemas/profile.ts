import mongoose from "mongoose";

const requiredString = {
    type: String,
    required: true,
}

const schema = new mongoose.Schema({
    guildId: requiredString,
    userId: requiredString,
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    },
    coins: {
        type: Number,
        default: 0,
    }
});

export default mongoose.model("profiles", schema, "profiles");