import { get } from "./server";
import logger from "jet-logger";
import { AppDataSource } from "@config/db";

const app = get();
const port = process.env.PORT;
AppDataSource.initialize().then(() => {
  logger.info(`Database connect success`);
  app.listen(port, () => {
    logger.info(`Server running on http://localhost:${port}`);
  });
});
