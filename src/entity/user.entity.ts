import { Gender as Sex } from "@enums/gender.enum";
import { UserRole as UserRole } from "@enums/role.enum";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { CommentEntity } from "./comment.entity";

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
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: "enum",
    enum: Sex,
    default: Sex.MALE,
  })
  sex: Sex;

  @Column({ nullable: true, type: "bytea" })
  image: Buffer;

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

  @OneToMany(() => CommentEntity, (cmt) => cmt.user)
  comments: CommentEntity[];
}
