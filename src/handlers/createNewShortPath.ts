import { Request, Response } from "express";
import isStringAndNotEmpty from "../helpers/isStringAndNotEmpty";
import createCustomShortPath from "../services/createCustomShortPath";
import createRandomShortPath from "../services/createRandomShortPath";

function sendErrorResponse(res: Response, statusCode: number, message: string) {
  res.status(statusCode).json({ error: message });
}

function sendSuccessResponse(
  res: Response,
  statusCode: number,
  message: string,
  shortPath: string
) {
  res.status(statusCode).json({ message, shortPath });
  console.log(shortPath);
}

export default async function createNewShortPath(req: Request, res: Response): Promise<void> {
  const { arbitraryUrl, desiredShortPath } = req.body;
  if (isStringAndNotEmpty(arbitraryUrl)) {
    if (isStringAndNotEmpty(desiredShortPath)) {
      const customUriCreated = await createCustomShortPath(
        arbitraryUrl,
        desiredShortPath
      );
      if (customUriCreated) {
        sendSuccessResponse(
          res,
          201,
          "New custom short path created",
          desiredShortPath
        );
      } else {
        sendErrorResponse(res, 409, "That short path is already taken");
      }
    } else {
      const { preexisting, shortPath } = await createRandomShortPath(
        arbitraryUrl
      );
      if (preexisting) {
        sendSuccessResponse(
          res,
          409,
          "That URL already has a short path in our system",
          shortPath
        );
      } else {
        sendSuccessResponse(
          res,
          201,
          "New random short path created",
          shortPath
        );
      }
    }
  } else {
    sendErrorResponse(
      res,
      400,
      "Missing required field in JSON body: 'arbitraryUrl'"
    );
  }
}
