import { ShortModel } from '../short/model';

async function create(arbitraryUri: string, customUri: string): Promise<boolean> {
    const exists = await ShortModel.exists({ short: customUri });
    if (exists) {
        return false;
    } else {
        const short = new ShortModel({
            custom: true,
            short: customUri,
            arbitrary: arbitraryUri
        })
        await short.save();
        return true;
    }
}