import * as baseX from 'base-x';
import * as Chance from 'chance';
import { createHash } from 'crypto';
import { MAX_TRIES, RANDOM_URI_LEN } from '../constants';
import { ShortModel } from '../short/model';

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const chance = Chance();

function fromHash(arbitraryUri: string): string {
    const hashBuffer = createHash('sha256').update(arbitraryUri);
    const encoded = baseX[BASE62].encode(hashBuffer);
    return encoded.slice(0, RANDOM_URI_LEN);
}

function fromRandomSelection(): string {
    return chance.string({ pool: BASE62, length: RANDOM_URI_LEN }, )
}

export default async function shortUri(arbitraryUri: string): Promise<string> {
    let potentialUri = fromHash(arbitraryUri);
    for (let triesCompleted = 0; triesCompleted < MAX_TRIES; triesCompleted++) {
        const shortUriAlreadyInUse = await ShortModel.exists({ short: potentialUri });
        if (shortUriAlreadyInUse) {
            potentialUri = fromRandomSelection();
        } else {
            return potentialUri
        }
    }
    throw new Error(`Did not find an unused short URI withinin ${MAX_TRIES} tries.`)
}