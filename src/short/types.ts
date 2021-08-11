import { Document, Model } from "mongoose";

export interface Short {
  short: string;
  custom: boolean;
  arbitrary: string;
  created: Date;
}

export interface ShortDocument extends Short, Document {}
export interface ShortModel extends Model<Short> {}