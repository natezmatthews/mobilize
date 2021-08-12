import availableShortPathString from '../helpers/availableShortPathString';
import { ShortPathModel } from '../short-path/model';
import { ShortPathDocument, ShortPathFields } from '../short-path/types';

interface OperationResult {
    preexisting: Boolean;
    shortPath: string
};

export default async function createRandomShortPath(arbitraryUrl: string): Promise<OperationResult> {
    const results = await ShortPathModel
        .find({ [ShortPathFields.arbitraryUrl]: arbitraryUrl, isCustom: false })
        .exec();

    let existing: ShortPathDocument;
    if (results.length > 0) {
        if (results.length > 1) {
            console.warn(`The arbitrary URL ${arbitraryUrl} has received multiple random short paths.`)
        }
        existing = results[0];
        return {
            preexisting: true,
            shortPath: existing.get('shortPath')
        }
    } else {
        const newShort = new ShortPathModel({
            [ShortPathFields.isCustom]: false,
            [ShortPathFields.arbitraryUrl]: arbitraryUrl,
            [ShortPathFields.shortPath]: await availableShortPathString(arbitraryUrl)
        })
        const short = await newShort.save();
        return {
            preexisting: false,
            shortPath: short.get('shortPath')
        }
    }
}