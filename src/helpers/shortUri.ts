import * as baseX from 'base-x';
import * as Chance from 'chance';
import { createHash } from 'crypto';
import { RANDOM_URI_LEN } from '../constants';

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const chance = Chance();

export function fromHash(arbitraryUri: string): string {
    const hashBuffer = createHash('sha256').update(arbitraryUri);
    const encoded = baseX[BASE62].encode(hashBuffer);
    return encoded.slice(0, RANDOM_URI_LEN);
}

export function fromRandomSelection() {
    return chance.string({ pool: BASE62, length: RANDOM_URI_LEN }, )
}