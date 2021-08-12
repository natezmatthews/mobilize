import { Document, Model } from "mongoose";

export enum ShortLinkFields {
  'shortPath' = 'shortPath',
  'isCustom' = 'isCustom',
  'arbitraryUrl' = 'arbitraryUrl',
  'createdDate' = 'createdDate'
};
export interface ShortLink {
  [ShortLinkFields.shortPath]: string;
  [ShortLinkFields.isCustom]: boolean;
  [ShortLinkFields.arbitraryUrl]: string;
  [ShortLinkFields.createdDate]: Date;
}
export type FieldNames = keyof ShortLink;

export interface ShortLinkDocument extends ShortLink, Document {}
export interface ShortLinkModel extends Model<ShortLink> {}