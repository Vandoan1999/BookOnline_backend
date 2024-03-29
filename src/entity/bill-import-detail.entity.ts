import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { BillImport } from "./bill-import.entity";
import { BookEntity } from "./book.entity";

@Entity("bill_import_detail")
export class BillImportDetail {
  @PrimaryColumn({ type: "uuid" })
  bill_import_id: string;

  @PrimaryColumn({ type: "uuid" })
  book_id: string;

  @Column({ type: "int" })
  quantity: number;

  @ManyToOne(() => BookEntity, (book) => book.bill_import_detail, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "book_id", referencedColumnName: "id" })
  book: BookEntity;

  @ManyToOne(() => BillImport, (bill) => bill.bill_import_details, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "bill_import_id", referencedColumnName: "id" })
  bill_import: BillImport;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
