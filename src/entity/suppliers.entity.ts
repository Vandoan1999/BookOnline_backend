import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("suppliers")
export class SupplierEnity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  company: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;
}
