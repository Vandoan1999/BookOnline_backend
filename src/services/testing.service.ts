import { config } from "@config/app";
import { AppDataSource } from "@config/db";
import { Service } from "typedi";
import logger from "jet-logger";

@Service()
export class TestingService {
  constructor() {}

  async clear() {
    logger.info(`start clearing data !`);
    await AppDataSource.query(`DELETE FROM ${config.TablePostgres.user} WHERE role = 'user'`);
    logger.info(`clear data ${config.TablePostgres.user} done !`);

    await AppDataSource.query(`DELETE FROM ${config.TablePostgres.books}`);
    logger.info(`clear data ${config.TablePostgres.books} done !`);

    await AppDataSource.query(`DELETE FROM ${config.TablePostgres.ratings}`);
    logger.info(`clear data ${config.TablePostgres.ratings} done !`);

    await AppDataSource.query(`DELETE FROM ${config.TablePostgres.book_images}`);
    logger.info(`clear data ${config.TablePostgres.book_images} done !`);

    await AppDataSource.query(`DELETE FROM ${config.TablePostgres.categories}`);
    logger.info(`clear data ${config.TablePostgres.categories} done !`);

    await AppDataSource.query(`DELETE FROM ${config.TablePostgres.suppliers}`);
    logger.info(`clear data ${config.TablePostgres.suppliers} done !`);
  }
}
