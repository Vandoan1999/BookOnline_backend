import { AppDataSource } from "@config/db";

AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
  })
  .catch((error: any) => console.log(error));
