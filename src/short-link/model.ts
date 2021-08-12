import { model } from "mongoose";
import ShortLinkSchema from "./schema";
import { ShortLinkDocument } from "./types";

export const ShortLinkModel = model<ShortLinkDocument>("short", ShortLinkSchema);