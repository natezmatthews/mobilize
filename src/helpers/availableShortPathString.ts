import * as baseX from "base-x";
import * as Chance from "chance";
import { createHash } from "crypto";
import { MAX_TRIES, RANDOM_URI_LEN } from "../constants";
import { ShortPathModel } from "../short-path/model";
import { ShortPathFields } from "../short-path/types";

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const chance = Chance();

function fromHash(arbitraryUrl: string): string {
  const hashBuffer = createHash("sha256").update(arbitraryUrl).digest();
  const encoded = baseX(BASE62).encode(hashBuffer);
  return encoded.slice(0, RANDOM_URI_LEN);
}

function fromRandomSelection(): string {
  return chance.string({ pool: BASE62, length: RANDOM_URI_LEN });
}

export default async function availableShortPathString(
  arbitraryUrl: string
): Promise<string> {
  let potentialShortPath = fromHash(arbitraryUrl);
  for (let triesCompleted = 0; triesCompleted < MAX_TRIES; triesCompleted++) {
    const shortPathIsAlreadyInUse = await ShortPathModel.exists({
      [ShortPathFields.shortPath]: potentialShortPath,
    });
    if (shortPathIsAlreadyInUse) {
      potentialShortPath = fromRandomSelection();
    } else {
      return potentialShortPath;
    }
  }
  throw new Error(
    `Did not find an unused short URI withinin ${MAX_TRIES} tries.`
  );
}
