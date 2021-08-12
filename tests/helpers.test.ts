import * as Chance from "chance";
import { BASE62, MAX_TRIES, RANDOM_SHORT_PATH_LEN } from "../src/constants";
import availableShortPath, {
  fromHash,
  fromRandomSelection
} from "../src/helpers/availableShortPath";
import isStringAndNotEmpty from "../src/helpers/isStringAndNotEmpty";
import { ShortLinkModel } from "../src/short-link/model";
const chance = Chance();

describe("Is string and not empty", () => {
  it("Returns false on something that is not a string", () => {
    expect(isStringAndNotEmpty(3 as any as string)).toBe(false);
  });

  it("Returns false on empty string", () => {
    expect(isStringAndNotEmpty("")).toBe(false);
  });

  it("Returns true on non-empty string", () => {
    expect(isStringAndNotEmpty("blah")).toBe(true);
  });
});

function expectedLengthAndCharacters(shortPath: string) {
  expect(typeof shortPath).toBe("string");
  expect(shortPath).toHaveLength(RANDOM_SHORT_PATH_LEN);
  const stringWithOnlyCharactersFromBase62 = new RegExp(`^[${BASE62}]+$`);
  expect(shortPath).toEqual(
    expect.stringMatching(stringWithOnlyCharactersFromBase62)
  );
}

describe("Finding an available short path", () => {
  describe("Getting a short path using a hash", () => {
    it("Should return a string with the expected length and characters", () => {
      const url = chance.string();
      const shortPathFromHash = fromHash(url);
      expectedLengthAndCharacters(shortPathFromHash);
    });

    it("The hash should return the same path for the same URL", () => {
      const url = chance.string();
      const shortPathFromHash = fromHash(url);
      const shortPathFromHash2 = fromHash(url);
      expect(shortPathFromHash).toEqual(shortPathFromHash2);
    });
  });

  describe("Get a short path that is random", () => {
    it("Should return a string with the expected length and characters", () => {
      const randomShortPath = fromRandomSelection();
      expectedLengthAndCharacters(randomShortPath);
    });

    it("Should return a different string each time", () => {
      const randomShortPath = fromRandomSelection();
      const randomShortPath2 = fromRandomSelection();
      expect(randomShortPath).not.toEqual(randomShortPath2);
    });
  });

  (ShortLinkModel as any).exists = jest.fn();

  describe("Find an available short path", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Tries random paths if the hash method does not work, until a retry limit", () => {
      (ShortLinkModel as any).exists.mockReturnValue(Promise.resolve(true));
      const arbitraryUrl = chance.string();

      expect(availableShortPath(arbitraryUrl)).rejects.toEqual(
        new Error(
          `Did not find an unused short URI withinin ${MAX_TRIES} tries.`
        )
      );
    });

    it("If the short path from the hash does not exist yet, return that", () => {
      (ShortLinkModel as any).exists.mockResolvedValueOnce(false);
      const arbitraryUrl = chance.string();
      const hashUrl = fromHash(arbitraryUrl);

      expect(availableShortPath(arbitraryUrl)).resolves.toEqual(hashUrl);
    });

    it("If the short path from the hash already exists, return a random one instead", () => {
      // Say the first try (the hash) is already taken, but the second try (the first random) is not:
      (ShortLinkModel as any).exists.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
      const arbitraryUrl = chance.string();
      const hashUrl = fromHash(arbitraryUrl);

      expect(availableShortPath(arbitraryUrl)).resolves.not.toEqual(hashUrl);
    });
  });
});
