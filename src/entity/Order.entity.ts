import { ShippingStatus } from "@enums/shipping-status.enum";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { OrderDetail } from "./order-detail.entity";
import { ShipperEntity } from "./shipper.entity";
import { UserEntity } from "./user.entity";

@Entity("orders")
export class OrdersEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  address: string;

  @Column({ nullable: true, default: ShippingStatus.OPENT })
  shipping_status: ShippingStatus;

  @Column({ nullable: true, type: "date" })
  order_date: Date;

  @Column({ nullable: true, type: "date" })
  shipped_date: Date;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  public user!: UserEntity;

  @OneToOne(() => ShipperEntity)
  @JoinColumn()
  shipper: ShipperEntity;

  @OneToMany(() => OrderDetail, (order_detail) => order_detail.order)
  orders_detail: OrderDetail[];
}
