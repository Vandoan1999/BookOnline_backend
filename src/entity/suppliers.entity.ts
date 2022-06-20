import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("suppliers")
export class SuppliersEnity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  company_name: string;

  @Column()
  contact_name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;
}
