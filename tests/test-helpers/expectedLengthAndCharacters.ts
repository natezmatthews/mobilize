import { BASE62, RANDOM_SHORT_PATH_LEN } from "../../src/constants";

export function expectedLengthAndCharacters(shortPath: string) {
  expect(typeof shortPath).toBe("string");
  expect(shortPath).toHaveLength(RANDOM_SHORT_PATH_LEN);
  const stringWithOnlyCharactersFromBase62 = new RegExp(`^[${BASE62}]+$`);
  expect(shortPath).toEqual(
    expect.stringMatching(stringWithOnlyCharactersFromBase62)
  );
}
