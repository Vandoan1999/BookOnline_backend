import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("shippers")
export class ShipperEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  phone: string;
}
