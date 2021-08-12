import * as Chance from "chance";
import { BASE62, RANDOM_SHORT_PATH_LEN } from "../src/constants";
import { fromHash, fromRandomSelection } from "../src/helpers/availableShortPath";
import isStringAndNotEmpty from "../src/helpers/isStringAndNotEmpty";
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
      it('Should return a string with the expected length and characters', () => {
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
  })

  describe('Get a short path that is random', () => {
    it('Should return a string with the expected length and characters', () => {
        const randomShortPath = fromRandomSelection();
        expectedLengthAndCharacters(randomShortPath);
      });
  })
});
