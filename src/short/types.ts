import { Document, Model } from "mongoose";

export interface Short {
  short: String;
  custom: Boolean;
  arbitrary: String;
  created: Date;
}

export interface ShortDocument extends Short, Document {}
export interface ShortModel extends Model<Short> {}