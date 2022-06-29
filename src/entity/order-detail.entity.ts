import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { BookEntity as BookEntity } from "./book.entity";
import { OrdersEntity as OrderEntity } from "./Order.entity";

@Entity("order_detail")
export class OrderDetail {
  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  order_id: number;

  @Column({ nullable: true, type: "int" })
  quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.orders_detail)
  @JoinColumn({ name: "order_id" })
  order: OrderEntity;

  @ManyToOne(() => BookEntity, (book) => book.order_detail)
  @JoinColumn({ name: "book_id" })
  book: BookEntity;
}
