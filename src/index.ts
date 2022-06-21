import logger from "jet-logger";
import server from "./server";

import { AppDataSource } from "@config/db";

AppDataSource.initialize()
  .then(() => {
    console.info("initialize databse success");
  })
  .catch((error: any) => console.log(error));
// Constants
const serverStartMsg = "Express server started on port: ",
  port = process.env.PORT || 3000;

// Start server
server.listen(port, () => {
  logger.info(serverStartMsg + port);
});
