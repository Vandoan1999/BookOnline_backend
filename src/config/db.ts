import { DataSource } from "typeorm";
import * as entiry from "@entity/index";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "12345678",
  database: "postgres",
  synchronize: true,
  logging: true,
  entities: [entiry.Users],
  subscribers: [],
  migrations: [],
});
