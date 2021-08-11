import { Schema } from "mongoose";

const ShortSchema = new Schema({
  short: { type: String, index: true },
  custom: Boolean,
  arbitrary: String,
  created: {
    type: Date,
    default: new Date()
  },
  visits: [Date]
});

export default ShortSchema;