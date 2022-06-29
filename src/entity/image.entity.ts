import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { BookEntity } from "./book.entity";

@Entity("book_images")
export class ImageEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  order: number;

  @ManyToOne((type) => BookEntity, (book) => book.images, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "book_id" })
  public book_id?: BookEntity;
}
