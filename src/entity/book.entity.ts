import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { CategoryEntity } from "./category.entity";
import { RatingEntity } from "./rating.entity";
import { BillImportDetail } from "./bill-import-detail.entity";
import { BillExportDetail } from "./bill-export-detail.entity";

@Entity("books")
export class BookEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  avartar: string;

  @Column({ nullable: true })
  images: string;

  @Column({ nullable: true, type: "int", default: 0 })
  discounted: number;

  @Column({ nullable: true, type: "double precision", default: 0 })
  price_import: number;

  @Column({ nullable: true, type: "double precision", default: 0 })
  price_export: number;

  @Column({ nullable: true, type: "double precision", default: 0 })
  rating_number: number;

  @Column({ nullable: true, type: "int", default: 0 })
  total_rating: number;

  @Column({ nullable: true, type: "int", default: 0 })
  sold: number;

  @Column({ nullable: true, type: "int", default: 0 })
  views: number;

  @Column({ nullable: true, type: "date" })
  published_date: Date;

  @Column({ nullable: true, type: "int", default: 0 })
  quantity: number;

  @Column({ nullable: true })
  publisher: string;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true, type: "text" })
  description: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @OneToMany(() => RatingEntity, (rating) => rating.book, {
    onDelete: "CASCADE",
    nullable: true,
  })
  ratings: [];

  @ManyToMany(() => CategoryEntity, (category) => category.books, {
    nullable: true,
  })
  @JoinTable()
  categories: CategoryEntity[];

  @OneToMany(
    () => BillImportDetail,
    (bill_export_detail) => bill_export_detail.book
  )
  bill_import_detail: BillImportDetail[];

  @OneToMany(
    () => BillExportDetail,
    (bill_export_detail) => bill_export_detail.book
  )
  bill_export_detail: BillExportDetail[];
}
