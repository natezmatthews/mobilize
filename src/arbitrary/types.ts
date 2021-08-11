import { Document, Model } from "mongoose";

export interface Arbitrary {
  arbitrary: String,
  randomUri: String,
  customUris: Array<String>
}

export interface ArbitraryDocument extends Arbitrary, Document {}
export interface ArbitraryModel extends Model<Arbitrary> {}