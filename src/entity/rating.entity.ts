import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { BooksEntity } from "./book.entity";
import { UserEntity } from "./user.entity";

@Entity("rating")
export class Rating {
  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  book_id: number;

  @Column({ nullable: true, type: "text" })
  content: string;

  @Column({ nullable: true, type: "int" })
  rating_number: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @OneToOne((type) => UserEntity)
  @JoinColumn({ name: "user_id" })
  public user!: UserEntity;

  @OneToOne((type) => BooksEntity)
  @JoinColumn({ name: "book_id" })
  public book!: BooksEntity;
}
