import { DataSource } from "typeorm";
import * as entiry from "@entity/index";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "54.255.213.102",
  port: 5432,
  username: "postgres",
  password: "12345678",
  database: "postgres",
  synchronize: true,
  logging: true,
  entities: [...Object.values(entiry).map((item) => item)],
  subscribers: [],
  migrations: [],
});
