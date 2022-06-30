import { CreateRatingRequest } from "@models/rating/create-rating.request";
import { CreateSupplierRequest } from "@models/supplier/create-supplier.request";
import { ListSupplierRequest } from "@models/supplier/list-supplier.request";
import { UpdateSupplierRequest } from "@models/supplier/update-supplier.request";
import { SupplierRepository } from "@repos/supplier.repository";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../ultis/apiError";

import { Service } from "typedi";

@Service()
export class SupplierService {
  getList(request: ListSupplierRequest) {
    return SupplierRepository.getList(request);
  }
  create(request: CreateSupplierRequest) {
    const supplier = SupplierRepository.create(request);
    return SupplierRepository.save(supplier);
  }
  update(request: UpdateSupplierRequest) {
    const supplier = SupplierRepository.findOneBy({
      id: request.id,
    });

    if (!supplier) {
      throw ApiError(StatusCodes.NOT_FOUND, `suppier with id: ${request.id} not found !`);
    }

    return SupplierRepository.update({ id: request.id }, request);
  }

  async delete(id: string) {
    const supplier = await SupplierRepository.findOne({
      where: { id },
    });

    if (!supplier) throw ApiError(StatusCodes.NOT_FOUND, `suppier with id: ${id} not found !`);

    return SupplierRepository.delete({ id });
  }

  async detail(id: string) {
    const supplier = await SupplierRepository.findOneBy({
      id,
    });

    if (!supplier) throw ApiError(StatusCodes.NOT_FOUND, `suppier with id: ${id} not found !`);

    return supplier;
  }
}
