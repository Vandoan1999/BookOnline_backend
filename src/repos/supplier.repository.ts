import { config } from "@config/app";
import { AppDataSource } from "@config/db";
import { SupplierEnity } from "@entity/supliers.entity";
import { ListSupplierRequest } from "@models/supplier/list-supplier.request";
import { OrderBy } from "@models/supplier/orderBy.enum";

export const SupplierRepository = AppDataSource.getRepository(
  SupplierEnity
).extend({
  getList(request: ListSupplierRequest) {
    const take = request.limit || config.page.default_limit;
    const page = request.page || 1;
    const skip = (page - 1) * take;

    const query = this.createQueryBuilder("supplier");
    if (request.search) {
      query.where("supplier.company LIKE :search", {
        search: `%${request.search}%`,
      });
    }

    if (request.address) {
      query.where("supplier.address LIKE :address", {
        address: `%${request.address}%`,
      });
    }

    if (request.phone) {
      query.where("supplier.phone LIKE :phone", {
        phone: `%${request.phone}%`,
      });
    }

    if (request.orderBy == OrderBy.address) {
      query.orderBy("supplier.address", request.order);
    } else if (request.orderBy == OrderBy.company) {
      query.orderBy("supplier.company", request.order);
    } else {
      query.orderBy("supplier.company", "ASC");
    }

    return query.take(take).skip(skip).getManyAndCount();
  },
});
