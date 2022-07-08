import { CreateRatingRequest } from "@models/rating/create-rating.request";
import { CreateSupplierRequest } from "@models/supplier/create-supplier.request";
import { ListSupplierRequest } from "@models/supplier/list-supplier.request";
import { UpdateSupplierRequest } from "@models/supplier/update-supplier.request";
import { SupplierRepository } from "@repos/supplier.repository";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../ultis/apiError";
import { Service } from "typedi";
import { In } from "typeorm";

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
      throw ApiError(
        StatusCodes.NOT_FOUND,
        `suppier with id: ${request.id} not found !`
      );
    }

    return SupplierRepository.update({ id: request.id }, request);
  }

  async delete(id: string) {
    const supplier = await SupplierRepository.findOne({
      where: { id },
    });

    if (!supplier)
      throw ApiError(
        StatusCodes.NOT_FOUND,
        `suppier with id: ${id} not found !`
      );

    return SupplierRepository.delete({ id });
  }
  async deleteMuiltiple(request: any) {
    if (request.query && request.query.ids) {
      let ids: any[] = request.query.ids.split(",");
      const books = await SupplierRepository.find({ where: { id: In(ids) } });
      if (books.length <= 0) {
        throw ApiError(
          StatusCodes.NOT_FOUND,
          `supplier width ids ${ids.toString()} not found`
        );
      }
      return SupplierRepository.remove(books);
    } else {
      throw ApiError(StatusCodes.BAD_REQUEST);
    }
  }

  async detail(id: string) {
    const supplier = await SupplierRepository.findOneBy({
      id,
    });

    if (!supplier)
      throw ApiError(
        StatusCodes.NOT_FOUND,
        `suppier with id: ${id} not found !`
      );

    return supplier;
  }
}
