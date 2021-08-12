import isStringAndNotEmpty from '../src/helpers/isStringAndNotEmpty';

describe('Is string and not empty', () => {
    it('Returns false on something that is not a string', () => {
        expect(isStringAndNotEmpty(3 as any as string)).toBe(false);
    })

    it('Returns false on empty string', () => {
        expect(isStringAndNotEmpty('')).toBe(false);
    })

    it('Returns true on non-empty string', () => {
        expect(isStringAndNotEmpty('blah')).toBe(true);
    })
})