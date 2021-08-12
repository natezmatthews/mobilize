import { model } from "mongoose";
import ShortPathSchema from "./schema";
import { ShortPathDocument } from "./types";

export const ShortPathModel = model<ShortPathDocument>("short", ShortPathSchema);