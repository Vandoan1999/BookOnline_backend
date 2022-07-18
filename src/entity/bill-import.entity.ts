import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BillImportDetail } from "./bill-import-detail.entity";
import { SupplierEnity } from "./supliers.entity";

@Entity("bill_import")
export class BillImport {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => SupplierEnity, (supplier) => supplier.bill_import, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "supplier_id", referencedColumnName: "id" })
  supplier: SupplierEnity;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @OneToMany(() => BillImportDetail, (bid) => bid.bill_import)
  bill_import_details: BillImportDetail[];
}
