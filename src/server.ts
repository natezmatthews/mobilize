import * as express from "express";
import { connect } from "./database";
import createNewShortPath from "./handlers/createNewShortPath";
import redirectShortLink from "./handlers/redirectShortLink";
import shortLinkStats from "./handlers/shortLinkStats";

const app = express();
const port = process.env.PORT || 5002;

connect();

app.use(express.json());

app.post("/new", createNewShortPath);

app.get('/i/:shortPath', redirectShortLink)

app.get('/stats/:shortPath', shortLinkStats)

export const server = app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
