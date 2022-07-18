import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { BookEntity } from "./book.entity";
import { UserEntity } from "./user.entity";

@Entity("rating")
export class RatingEntity {
  @ManyToOne(() => UserEntity, (user) => user.ratings, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @Column({ type: "uuid", name: "user_id", primary: true })
  public user_id: UserEntity;

  @ManyToOne(() => BookEntity, (book) => book.ratings, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @Column({ type: "uuid", name: "book_id", primary: true })
  public book_id: BookEntity;

  @Column({ nullable: true, type: "text" })
  content: string;

  @Column({ nullable: true, type: "float" })
  rating_number: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}
