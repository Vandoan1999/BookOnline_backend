import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { BillExport } from "./bill-export.entity";
import { BookEntity } from "./book.entity";

@Entity("bill_export_detail")
export class BillExportDetail {
  @PrimaryColumn({ type: "uuid" })
  bill_export_id: string;

  @PrimaryColumn({ type: "uuid" })
  book_id: string;

  @Column({ type: "int" })
  quantity: number;

  @ManyToOne(() => BookEntity, (book) => book.bill_export_detail, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "book_id", referencedColumnName: "id" })
  book: BookEntity;

  @ManyToOne(() => BillExport, (bill) => bill.bill_export_detail, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "bill_export_id", referencedColumnName: "id" })
  bill_export: BillExport;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
