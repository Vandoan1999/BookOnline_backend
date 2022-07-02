import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { BookEntity } from "./book.entity";

@Entity("categories")
export class CategoryEntity {
  //thể loại
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  image: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @ManyToMany(() => BookEntity, (book) => book.categories, {
    onDelete: "SET NULL",
    nullable: true,
  })
  books: BookEntity[];
}
