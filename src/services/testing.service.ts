import { config } from "@config/app";
import { AppDataSource } from "@config/db";
import Container, { Service } from "typedi";
import logger from "jet-logger";
import { faker } from "@faker-js/faker";
import { RegisterRequest } from "@models/auth/register.request";
import { Role } from "@enums/role.enum";
import { AuthService } from "./auth.service";
@Service()
export class TestingService {
  constructor() {}
  private list_user: any[] = [];
  private list_supplier: any[] = [];
  private list_category: any[] = [];
  private list_book: any[] = [];
  async clear() {
    logger.info(`start clearing data !`);
    await AppDataSource.query(
      `DELETE FROM ${config.TablePostgres.user} WHERE role = 'user'`
    );
    logger.info(`clear data ${config.TablePostgres.user} done !`);

    await AppDataSource.query(`DELETE FROM ${config.TablePostgres.books}`);
    logger.info(`clear data ${config.TablePostgres.books} done !`);

    await AppDataSource.query(`DELETE FROM ${config.TablePostgres.ratings}`);
    logger.info(`clear data ${config.TablePostgres.ratings} done !`);

    await AppDataSource.query(
      `DELETE FROM ${config.TablePostgres.book_images}`
    );
    logger.info(`clear data ${config.TablePostgres.book_images} done !`);

    await AppDataSource.query(`DELETE FROM ${config.TablePostgres.categories}`);
    logger.info(`clear data ${config.TablePostgres.categories} done !`);

    await AppDataSource.query(`DELETE FROM ${config.TablePostgres.suppliers}`);
    logger.info(`clear data ${config.TablePostgres.suppliers} done !`);
  }
}
