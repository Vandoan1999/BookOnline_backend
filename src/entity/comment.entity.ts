import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BooksEntity } from "./book.entity";
import { UserEntity } from "./user.entity";

@Entity("comments")
export class CommentEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, type: "double precision", default: 0 })
  rating: number;

  @Column({ nullable: true, type: "text" })
  content: string;

  @Column({ nullable: true, type: "int", default: 0 })
  like_count: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  user: UserEntity;

  @ManyToOne(() => BooksEntity, (book) => book.comments)
  book: BooksEntity;
}
