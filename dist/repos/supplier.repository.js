"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierRepository = void 0;
const app_1 = require("@config/app");
const db_1 = require("@config/db");
const suppliers_entity_1 = require("@entity/suppliers.entity");
const orderBy_enum_1 = require("@models/supplier/orderBy.enum");
exports.SupplierRepository = db_1.AppDataSource.getRepository(suppliers_entity_1.SupplierEnity).extend({
    getList(request) {
        const take = request.limit || app_1.config.page.default_limit;
        const page = request.page || 1;
        const skip = (page - 1) * take;
        const query = this.createQueryBuilder("supplier");
        if (request.search) {
            query.where("supplier.company LIKE :search", { search: `%${request.search}%` });
        }
        if (request.address) {
            query.where("supplier.address LIKE :address", { address: `%${request.address}%` });
        }
        if (request.phone) {
            query.where("supplier.phone LIKE :phone", { phone: `%${request.phone}%` });
        }
        if (request.orderBy == orderBy_enum_1.OrderBy.address) {
            query.orderBy("supplier.address", request.order);
        }
        else if (request.orderBy == orderBy_enum_1.OrderBy.company) {
            query.orderBy("supplier.company", request.order);
        }
        else {
            query.orderBy("supplier.company", "ASC");
        }
        return query.take(take).skip(skip).getManyAndCount();
    },
});
