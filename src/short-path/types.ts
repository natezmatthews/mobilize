import { Document, Model } from "mongoose";

export enum ShortPathFields {
  'shortPath' = 'shortPath',
  'isCustom' = 'isCustom',
  'arbitraryUrl' = 'arbitraryUrl',
  'createdDate' = 'createdDate'
};
export interface ShortPath {
  [ShortPathFields.shortPath]: string;
  [ShortPathFields.isCustom]: boolean;
  [ShortPathFields.arbitraryUrl]: string;
  [ShortPathFields.createdDate]: Date;
}
export type FieldNames = keyof ShortPath;

export interface ShortPathDocument extends ShortPath, Document {}
export interface ShortPathModel extends Model<ShortPath> {}