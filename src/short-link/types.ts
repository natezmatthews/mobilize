import { Document, Model } from "mongoose";

export enum ShortLinkFields {
  'shortPath' = 'shortPath',
  'isCustom' = 'isCustom',
  'arbitraryUrl' = 'arbitraryUrl',
  'createdDate' = 'createdDate',
  'visits' = 'visits'
};
export interface ShortLink {
  [ShortLinkFields.shortPath]: string;
  [ShortLinkFields.isCustom]: boolean;
  [ShortLinkFields.arbitraryUrl]: string;
  [ShortLinkFields.createdDate]: Date;
  [ShortLinkFields.visits]: Array<Date>;
}
export type FieldNames = keyof ShortLink;

export interface ShortLinkDocument extends ShortLink, Document {}
export interface ShortLinkModel extends Model<ShortLink> {}