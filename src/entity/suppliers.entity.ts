import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BookEntity } from "./book.entity";

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

  @OneToMany(() => BookEntity, (book) => book.supplier)
  books: BookEntity[];
}
