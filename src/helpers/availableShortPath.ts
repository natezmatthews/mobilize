import * as baseX from "base-x";
import * as Chance from "chance";
import { createHash } from "crypto";
import { BASE62, MAX_TRIES, RANDOM_SHORT_PATH_LEN } from "../constants";
import { ShortLinkModel } from "../short-link/model";
import { ShortLinkFields } from "../short-link/types";

const chance = Chance();

export function fromHash(arbitraryUrl: string): string {
  const hashBuffer = createHash("sha256").update(arbitraryUrl).digest();
  const encoded = baseX(BASE62).encode(hashBuffer);
  return encoded.slice(0, RANDOM_SHORT_PATH_LEN);
}

export function fromRandomSelection(): string {
  return chance.string({ pool: BASE62, length: RANDOM_SHORT_PATH_LEN });
}

export default async function availableShortPath(
  arbitraryUrl: string
): Promise<string | Error> {
  let potentialShortPath = fromHash(arbitraryUrl);
  for (let triesCompleted = 0; triesCompleted < MAX_TRIES; triesCompleted++) {
    const shortPathIsAlreadyInUse = await ShortLinkModel.exists({
      [ShortLinkFields.shortPath]: potentialShortPath,
    });
    if (shortPathIsAlreadyInUse) {
      potentialShortPath = fromRandomSelection();
    } else {
      return potentialShortPath;
    }
  }
  return Promise.reject(
    new Error(`Did not find an unused short URI withinin ${MAX_TRIES} tries.`)
  );
}
