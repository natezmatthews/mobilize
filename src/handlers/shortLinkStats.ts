import { Request, Response } from "express";
import { countBy, isNull } from "lodash";
import findOneShortLink from "../helpers/findOneShortLink";
import isoDateString from "../helpers/isoDateString";
import isStringAndNotEmpty from "../helpers/isStringAndNotEmpty";
import { ShortLinkFields } from "../short-link/types";

export default async function shortLinkStats(req: Request, res: Response) {
  const validParam = isStringAndNotEmpty(req.params["shortPath"]);
  if (!validParam) {
    return res.status(400).json({ error: "Missing valid path" });
  }

  const shortLink = await findOneShortLink(req.params.shortPath);
  if (isNull(shortLink)) {
    return res.sendStatus(404);
  }
  const visits = shortLink.get(ShortLinkFields.visits);
  return res.status(200).json({
    createdDate: shortLink.get(ShortLinkFields.createdDate),
    totalNumberOfVisits: visits.length,
    visitsEachDay: countBy(visits, isoDateString)
  });
}
