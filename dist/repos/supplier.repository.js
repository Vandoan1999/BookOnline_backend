"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierRepository = void 0;
const app_1 = require("@config/app");
const db_1 = require("@config/db");
const supliers_entity_1 = require("@entity/supliers.entity");
exports.SupplierRepository = db_1.AppDataSource.getRepository(supliers_entity_1.SupplierEnity).extend({
    getList(request) {
        const take = request.limit || app_1.config.page.default_limit;
        const page = request.page || 1;
        const skip = (page - 1) * take;
        const query = this.createQueryBuilder("supplier");
        return query.take(take).skip(skip).getManyAndCount();
    },
});
