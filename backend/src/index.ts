import { log } from "console";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config();

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (err) => {
      log("ERR:-", err);
      throw err;
    });
    app.listen(port, () => {
      log(`Server is running at port: ${port}...`);
    });
  })
  .catch((err: Error) => {
    log("MongoDb connection failed !!!", err);
  });
