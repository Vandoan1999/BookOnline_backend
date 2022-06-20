import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { BooksEntity } from "./book.entity";

@Entity("book_images")
export class ImagesEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, type: "bytea" })
  data: Buffer;

  @Column({ nullable: true })
  order: number;

  @OneToOne((type) => BooksEntity)
  @JoinColumn()
  public book!: BooksEntity;
}
