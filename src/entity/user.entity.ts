import { Gender as Sex } from "@enums/gender.enum";
import { Role as Role } from "@enums/role.enum";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { CommentEntity } from "./comment.entity";
import { RatingEntity } from "./rating.entity";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({
    type: "enum",
    enum: Sex,
    nullable: true,
  })
  sex: Sex;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  bank: string;

  @Column({ nullable: true, type: "bool" })
  is_pass_change: boolean;

  @Column({ nullable: true, type: "bool", default: true })
  is_active: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @OneToMany(() => CommentEntity, (cmt) => cmt.user, {
    onDelete: "CASCADE",
  })
  comments: CommentEntity[];

  @OneToMany(() => RatingEntity, (rating) => rating.user_id, {
    onDelete: "CASCADE",
  })
  ratings: [];
}
