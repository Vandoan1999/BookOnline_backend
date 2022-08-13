import { BillExportStatus } from "@models/bill_export/bill-export-status.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BillExportDetail } from "./bill-export-detail.entity";
import { UserEntity } from "./user.entity";

@Entity("bill_export")
export class BillExport {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.bill_export, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: UserEntity;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @Column({
    type: "enum",
    enum: BillExportStatus,
    default: BillExportStatus.Pending,
  })
  status: BillExportStatus;

  @OneToMany(() => BillExportDetail, (bid) => bid.bill_export)
  bill_export_detail: BillExportDetail[];
}
