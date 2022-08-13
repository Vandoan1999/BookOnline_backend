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
    return query.take(take).skip(skip).getManyAndCount();
  },
});
