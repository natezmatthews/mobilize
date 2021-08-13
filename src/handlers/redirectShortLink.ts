import { Request, Response } from "express";
import { isNull } from "lodash";
import findOneShortLink from "../helpers/findOneShortLink";
import isStringAndNotEmpty from "../helpers/isStringAndNotEmpty";
import { ShortLinkFields } from "../short-link/types";

export default async function redirectShortLink(req: Request, res: Response) {
  const validParam = isStringAndNotEmpty(req.params["shortPath"]);
  if (!validParam) {
    return res.status(400).json({ error: "Missing valid path" });
  }

  const shortLink = await findOneShortLink(req.params.shortPath);
  if (isNull(shortLink)) {
    return res.sendStatus(404);
  }
  shortLink.visits.push(new Date()); // Record this visit
  await shortLink.save();
  return res.redirect(shortLink.get(ShortLinkFields.arbitraryUrl));
}
