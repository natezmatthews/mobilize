import { ShortLinkModel } from '../short-link/model';
import { ShortLinkFields } from '../short-link/types';

export default async function createCustomShortPath(arbitraryUrl: string, desiredShortPath: string): Promise<boolean> {
    const exists = await ShortLinkModel.exists({ [ShortLinkFields.shortPath]: desiredShortPath });
    if (exists) {
        return false;
    } else {
        const short = new ShortLinkModel({
            [ShortLinkFields.isCustom]: true,
            [ShortLinkFields.shortPath]: desiredShortPath,
            [ShortLinkFields.arbitraryUrl]: arbitraryUrl
        })
        await short.save();
        return true;
    }
}