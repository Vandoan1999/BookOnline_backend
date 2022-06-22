import logger from "jet-logger";
import server from "./server";
import serverless from'serverless-http'
import { AppDataSource } from "@config/db";

AppDataSource.initialize()
  .then(() => {
    console.info("initialize databse success");
    
  })
  .catch((error: any) => console.log(error));
	
module.exports.handler = serverless(server);