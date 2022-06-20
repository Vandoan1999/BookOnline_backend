import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { CommentEntity } from "./comment.entity";
import { GenresEntity } from "./genres.entity";
import { OrderDetail as OrderDetailEntity } from "./order-detail.entity";
import { SuppliersEnity } from "./suppliers.entity";

@Entity("books")
export class BooksEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, type: "int", default: 0 })
  discounted: number;

  @Column({ nullable: true, type: "double precision", default: 0 })
  price_import: number;

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

  @Column({ nullable: true, type: "date" })
  created_at: Date;

  @Column({ nullable: true, type: "date" })
  updated_at: Date;

  @OneToOne(() => SuppliersEnity)
  @JoinColumn()
  public suppplier!: SuppliersEnity;

  @ManyToMany(() => GenresEntity)
  @JoinTable()
  genres: GenresEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.book)
  @JoinTable()
  comments: CommentEntity[];

  @OneToMany(() => OrderDetailEntity, (order) => order.book)
  order_detail: OrderDetailEntity[];
}
