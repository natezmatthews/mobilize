import { Schema } from "mongoose";
import { Short } from "./types";

const ShortSchema = new Schema<Short>({
  short: { type: String, index: true },
  arbitrary: { type: String, index: true },
  custom: { type: Boolean, required: true },
  created: {
    type: Date,
    required: true,
    default: new Date()
  },
  visits: [Date]
});

export default ShortSchema;