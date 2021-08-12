import { Request, Response } from "express";
import { ShortLinkModel } from "../short-link/model";
import { ShortLinkFields } from "../short-link/types";

export default async function redirectShortLink(req: Request, res: Response) {
  const shortPath = req.params.shortPath;
  const results = await ShortLinkModel.find({
    [ShortLinkFields.shortPath]: shortPath,
  }).exec();
  if (results.length === 0) {
    res.sendStatus(404);
  } else {
    if (results.length > 1) {
      console.warn(`Short path ${shortPath} maps to multiple arbitrary URLs`);
    }

    const shortLink = results[0];
    res.redirect(shortLink.get(ShortLinkFields.arbitraryUrl));
    shortLink.visits.push(new Date());
    shortLink.save();
  }
}
