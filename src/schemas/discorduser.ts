import mongoose from "mongoose";

const requiredString = {
    type: String,
    required: true,
}

const schema = new mongoose.Schema({
    id: requiredString,
});

export default mongoose.model("discordusers", schema, "discordusers");