import { Schema } from "mongoose";
import { ShortPath } from "./types";

const ShortPathSchema = new Schema<ShortPath>({
  shortPath: { type: String, index: true },
  arbitraryUrl: { type: String, index: true },
  isCustom: { type: Boolean, required: true },
  createdDate: {
    type: Date,
    required: true,
    default: new Date()
  },
  visits: [Date]
});

export default ShortPathSchema;