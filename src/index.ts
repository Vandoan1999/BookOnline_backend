import logger from "jet-logger";
import server from "./server";

import { AppDataSource } from "@config/db";
const serverStartMsg = "Express server started on port: ",
  port = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.info("initialize databse success");
    server.listen(port, () => {
      logger.info(serverStartMsg + port);
    });

  })
  .catch((error: any) => console.log(error));
// Constants

// Start server
