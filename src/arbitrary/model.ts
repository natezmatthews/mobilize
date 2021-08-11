import { model } from "mongoose";
import ArbitrarySchema from "./schema";
import { ArbitraryDocument } from "./types";

export const ArbitraryModel = model<ArbitraryDocument>("arbitrary", ArbitrarySchema);