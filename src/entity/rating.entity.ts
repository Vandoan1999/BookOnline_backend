import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from "typeorm";
import { BookEntity } from "./book.entity";
import { UserEntity } from "./user.entity";

@Entity("rating")
export class RatingEntity {
  @PrimaryColumn({ type: "uuid" })
  user_id: string;

  @PrimaryColumn({ type: "uuid" })
  book_id: string;

  @Column({ nullable: true, type: "text" })
  content: string;

  @Column({ nullable: true, type: "float" })
  rating_number: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.ratings, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  public user: UserEntity;

  @ManyToOne(() => BookEntity, (book) => book.ratings, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "book_id", referencedColumnName: "id" })
  public book: BookEntity;
}
