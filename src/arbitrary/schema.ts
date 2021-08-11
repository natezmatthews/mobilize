import { Schema } from "mongoose";

const ArbitrarySchema = new Schema({
  arbitrary: String,
  randomUri: String,
  customUris: [String]
});

export default ArbitrarySchema;