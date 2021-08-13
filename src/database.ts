import * as Mongoose from "mongoose";
let database: Mongoose.Connection;

export function connect(): void {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/mobilize_default";
  if (database) {
    return;
  }
  Mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  database = Mongoose.connection;
  database.once("open", async () => {
    console.log("Connected to database");
  });
  database.on("error", () => {
    console.log("Error connecting to database");
  });
};

export function disconnect(): void {
  if (!database) {
    return;
  }
  Mongoose.disconnect();
};
