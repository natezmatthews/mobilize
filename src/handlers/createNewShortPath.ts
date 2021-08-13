import { Request, Response } from "express";
import isStringAndNotEmpty from "../helpers/isStringAndNotEmpty";
import validCustomShortPath from "../helpers/validCustomShortPath";
import createCustomShortPath from "../services/createCustomShortPath";
import createRandomShortPath from "../services/createRandomShortPath";

function sendErrorResponse(
  res: Response,
  statusCode: number,
  message: string
): Response {
  return res.status(statusCode).json({ error: message });
}

function sendSuccessResponse(
  res: Response,
  statusCode: number,
  message: string,
  shortPath: string
): Response {
  return res.status(statusCode).json({ message, shortPath });
}

async function customShortPathCase(
  res: Response,
  arbitraryUrl: string,
  desiredShortPath: string
): Promise<Response> {
  const isValidCustomShortPath = validCustomShortPath(desiredShortPath);
  if (isValidCustomShortPath) {
    let customUriCreated: Boolean;
    try {
      customUriCreated = await createCustomShortPath(
        arbitraryUrl,
        desiredShortPath
      );
    } catch (error) {
      console.error(error);
      return sendErrorResponse(
        res,
        500,
        "Unknown error when creating custom short path"
      );
    }
    if (customUriCreated) {
      return sendSuccessResponse(
        res,
        201,
        "New custom short path created",
        desiredShortPath
      );
    } else {
      return sendErrorResponse(res, 409, "That short path is already taken");
    }
  } else {
    return sendErrorResponse(
      res,
      400,
      "The short path can only contain A-Z, a-z, 0-9, _ or -"
    );
  }
}

async function randomShortPathCase(
  res: Response,
  arbitraryUrl: string
): Promise<Response> {
  let preexisting: Boolean;
  let shortPath: string;
  try {
    const result = await createRandomShortPath(arbitraryUrl);
    preexisting = result.preexisting;
    shortPath = result.shortPath;
  } catch (error) {
    console.error(error);
    return sendErrorResponse(
      res,
      500,
      "Unknown error when creating random short path"
    );
  }
  if (preexisting) {
    return sendSuccessResponse(
      res,
      409,
      "That URL already has a short path in our system",
      shortPath
    );
  } else {
    return sendSuccessResponse(
      res,
      201,
      "New random short path created",
      shortPath
    );
  }
}

export default async function createNewShortPath(
  req: Request,
  res: Response
): Promise<Response> {
  const { arbitraryUrl, desiredShortPath } = req.body;
  if (isStringAndNotEmpty(arbitraryUrl)) {
    if (isStringAndNotEmpty(desiredShortPath)) {
      return customShortPathCase(res, arbitraryUrl, desiredShortPath);
    } else {
      return randomShortPathCase(res, arbitraryUrl);
    }
  } else {
    return sendErrorResponse(
      res,
      400,
      "Missing required field in JSON body: 'arbitraryUrl'"
    );
  }
}
