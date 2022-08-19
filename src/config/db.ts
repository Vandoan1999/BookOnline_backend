import { DataSource } from "typeorm";
import * as entiry from "@entity/index";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "13.212.33.6",
  port: 5432,
  username: "postgres",
  password: "12345678",
  database: "postgres",
  synchronize: false,
  logging: false,
  entities: [...Object.values(entiry).map((item) => item)],
  subscribers: [],
  migrations: [],
});
