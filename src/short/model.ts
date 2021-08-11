import { model } from "mongoose";
import ShortSchema from "./schema";
import { ShortDocument } from "./types";

export const ShortModel = model<ShortDocument>("short", ShortSchema);