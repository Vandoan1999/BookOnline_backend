import { Entity, Column, JoinColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { BooksEntity } from "./book.entity";
import { UserEntity } from "./user.entity";

@Entity("rating")
export class RatingEntity {

  @ManyToOne(() => UserEntity, (user) => user.ratings, {
    onDelete: "CASCADE",
    nullable: false
  })
  @Column({ type: "uuid", name: "user_id", primary: true })
  public user_id!: UserEntity;

  @ManyToOne(() => BooksEntity, book => book.ratings, {
    onDelete: "CASCADE",
    nullable: false
  })
  @Column({ type: "uuid", name: "book_id", primary: true })
  public book_id!: BooksEntity;

  @Column({ nullable: true, type: "text" })
  content: string;

  @Column({ nullable: true, type: "int" })
  rating_number: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;


}
