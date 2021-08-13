import availableShortPath from "../helpers/availableShortPath";
import { ShortLinkModel } from "../short-link/model";
import { ShortLinkDocument, ShortLinkFields } from "../short-link/types";

interface OperationResult {
  preexisting: Boolean;
  shortPath: string;
}

export default async function createRandomShortPath(
  arbitraryUrl: string
): Promise<OperationResult> {
  const results = await ShortLinkModel.find({
    [ShortLinkFields.arbitraryUrl]: arbitraryUrl,
    isCustom: false,
  }).exec();

  let existing: ShortLinkDocument;
  if (results.length > 0) {
    if (results.length > 1) {
      console.warn(
        `The arbitrary URL ${arbitraryUrl} has received multiple random short paths.`
      );
    }
    existing = results[0];
    return {
      preexisting: true,
      shortPath: existing.get(ShortLinkFields.shortPath),
    };
  } else {
    const newShort = new ShortLinkModel({
      [ShortLinkFields.isCustom]: false,
      [ShortLinkFields.arbitraryUrl]: arbitraryUrl,
      [ShortLinkFields.shortPath]: await availableShortPath(arbitraryUrl),
    });
    const short = await newShort.save();
    return {
      preexisting: false,
      shortPath: short.get(ShortLinkFields.shortPath),
    };
  }
}
