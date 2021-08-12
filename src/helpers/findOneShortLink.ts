import { ShortLinkModel } from "../short-link/model";
import { ShortLinkDocument, ShortLinkFields } from "../short-link/types";

export default async function findOneShortLink(
  shortPath: string
): Promise<ShortLinkDocument | null> {
  const results = await ShortLinkModel.find({
    [ShortLinkFields.shortPath]: shortPath,
  }).exec();
  if (results.length === 0) {
    return null;
  } else {
    if (results.length > 1) {
      console.warn(`Short path ${shortPath} maps to multiple arbitrary URLs`);
    }

    return results[0];
  }
}
