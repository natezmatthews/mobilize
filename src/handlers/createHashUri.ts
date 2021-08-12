import shortUri from '../helpers/shortUri';
import { ShortModel } from "../short/model";
import { ShortDocument } from "../short/types";

interface OperationResult {
    preexisting: Boolean;
    uri: string
};

export default async function createHashUri(arbitraryUri: string): Promise<OperationResult> {
    const results = await ShortModel
        .find({ arbitrary: arbitraryUri, custom: false })
        .exec();

    let existing: ShortDocument;
    if (results.length > 0) {
        if (results.length > 1) {
            console.warn(`The arbitrary URI ${arbitraryUri} has received multiple hash URIs.`)
        }
        existing = results[0];
        return {
            preexisting: true,
            uri: existing.get('short')
        }
    } else {
        const newShort = new ShortModel({
            custom: false,
            arbitrary: arbitraryUri,
            short: await shortUri(arbitraryUri)
        })
        const short = await newShort.save();
        return {
            preexisting: false,
            uri: short.get('short')
        }
    }
}