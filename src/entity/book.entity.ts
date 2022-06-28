import { Entity, Column, OneToOne, JoinColumn, JoinTable, ManyToMany, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { CategoryEntity } from "./category.entity";
import { ImageEntity } from "./image.entity";
import { OrderDetail as OrderDetailEntity } from "./order-detail.entity";
import { RatingEntity } from "./rating.entity";
import { SuppliersEnity } from "./suppliers.entity";

@Entity("books")
export class BookEntity {
  @PrimaryColumn()
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

  @OneToOne(() => SuppliersEnity)
  @JoinColumn()
  public suppplier!: SuppliersEnity;

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
  })
  ratings: [];

  @OneToMany(() => ImageEntity, (rating) => rating.book_id, {
    onDelete: "CASCADE",
  })
  images: [];

  @ManyToMany(() => CategoryEntity, (category) => category.books, {
    onDelete: "CASCADE",
  })
  @JoinTable()
  categories: CategoryEntity[];
}
