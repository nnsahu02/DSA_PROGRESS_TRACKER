import { Schema, model } from "mongoose";

export const ConfigSchema = new Schema({
    configName: {
        type: String,
        default: "default"
    },
    isSeedingDone: {
        type: Boolean,
        default: false
    }
})

export const ConfigModel = model("Config", ConfigSchema);