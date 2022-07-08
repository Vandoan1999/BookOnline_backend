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
  PrimaryColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { CommentEntity } from "./comment.entity";
import { CategoryEntity } from "./category.entity";
import { ImageEntity } from "./image.entity";
import { OrderDetail as OrderDetailEntity } from "./order-detail.entity";
import { RatingEntity } from "./rating.entity";
import { SupplierEnity } from "./suppliers.entity";

@Entity("books")
export class BookEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, type: "int", default: 0 })
  discounted: number;

  @Column({ nullable: true, type: "double precision", default: 0 })
  price_import: number;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, type: "double precision", default: 0 })
  price_export: number;

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

  @ManyToOne(() => SupplierEnity, (sp) => sp.books, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  supplier: SupplierEnity;

  @OneToMany(() => CommentEntity, (comment) => comment.book, {
    onDelete: "CASCADE",
  })
  @JoinTable()
  comments: CommentEntity[];

  @OneToMany(() => OrderDetailEntity, (order) => order.book, {
    onDelete: "CASCADE",
  })
  order_detail: OrderDetailEntity[];

  @OneToMany(() => RatingEntity, (rating) => rating.book_id, {
    onDelete: "CASCADE",
    nullable: true,
  })
  ratings: [];

  @OneToMany(() => ImageEntity, (rating) => rating.book_id, {
    onDelete: "CASCADE",
    nullable: true,
  })
  images: ImageEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.books, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinTable()
  categories: CategoryEntity[];
}
