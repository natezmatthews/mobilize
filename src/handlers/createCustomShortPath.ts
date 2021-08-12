import { ShortPathModel } from '../short-path/model';
import { ShortPathFields } from '../short-path/types';

export default async function createCustomShortPath(arbitraryUrl: string, desiredShortPath: string): Promise<boolean> {
    const exists = await ShortPathModel.exists({ [ShortPathFields.shortPath]: desiredShortPath });
    if (exists) {
        return false;
    } else {
        const short = new ShortPathModel({
            [ShortPathFields.isCustom]: true,
            [ShortPathFields.shortPath]: desiredShortPath,
            [ShortPathFields.arbitraryUrl]: arbitraryUrl
        })
        await short.save();
        return true;
    }
}