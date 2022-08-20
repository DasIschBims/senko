import mongoose from "mongoose";

const requiredString = {
    type: String,
    required: true,
}

const schema = new mongoose.Schema({
    id: requiredString,
    accessToken: requiredString,
    refreshToken: requiredString,
});

export default mongoose.model("discordusers", schema, "discordusers");