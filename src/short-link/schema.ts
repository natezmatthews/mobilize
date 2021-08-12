import { Schema } from "mongoose";
import { ShortLink } from "./types";

const ShortLinkSchema = new Schema<ShortLink>({
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

export default ShortLinkSchema;