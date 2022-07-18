import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { BillImport } from "./bill-import.entity";
import { BookEntity } from "./book.entity";

@Entity("suppliers")
export class SupplierEnity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  company: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(() => BillImport, (bill_import) => bill_import.supplier)
  bill_import: BillImport[];
}
