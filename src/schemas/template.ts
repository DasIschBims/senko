import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: String,
    value: String,
    type: String,
    description: String,
});

export default mongoose.model("template", schema, "template");