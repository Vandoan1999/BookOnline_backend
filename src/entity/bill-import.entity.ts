import { ShippingStatus } from "@enums/shipping-status.enum";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class BillImport {
  id: string;
  id_provider: string;
  created_at: Date;
}
