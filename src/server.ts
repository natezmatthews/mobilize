import * as express from "express";
import { connect } from "./database";
import createCustomUri from "./handlers/createCustomUri";
import createHashUri from "./handlers/createHashUri";
import isStringAndNotEmpty from "./helpers/isStringAndNotEmpty";

const app = express();
const port = 5002;

connect();

app.use(express.json());

function sendErrorResponse(res, statusCode, message) {
  res.status(statusCode).json({ error: message });
}

function sendSuccessResponse(res, statusCode, message, uri) {
  res.status(statusCode).json({ message, uri });
}

app.post("/new", async (req, res) => {
  const { arbitraryUri, desiredUri } = req.body;
  if (isStringAndNotEmpty(arbitraryUri)) {
    if (isStringAndNotEmpty(desiredUri)) {
      const customUriCreated = await createCustomUri(arbitraryUri, desiredUri);
      if (customUriCreated) {
        sendSuccessResponse(res, 201, "New custom URI created", desiredUri);
      } else {
        sendErrorResponse(res, 409, "That custom URI is already taken");
      }
    } else {
      const { preexisting, uri } = await createHashUri(arbitraryUri);
      if (preexisting) {
        sendSuccessResponse(
          res,
          409,
          "That URI already has a shortened URI in our system",
          uri
        );
      } else {
        sendSuccessResponse(res, 201, "New custom URI created", uri);
      }
    }
  } else {
    sendErrorResponse(
      res,
      400,
      "Missing required field in JSON body: 'arbitraryUri'"
    );
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
