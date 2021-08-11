import * as express from "express";
import { connect } from "./database";

const app = express();
const port = 5002;

connect();

app.use(express.json())

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
