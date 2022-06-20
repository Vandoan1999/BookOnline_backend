import { Gender } from "@enums/gender.enum";
import { Role } from "@enums/role.enum";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { CommentEntity } from "./comment.entity";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: Role;

  @Column()
  gender: Gender;

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

  @Column({ nullable: true, type: "bool" })
  is_active: boolean;

  @Column({ nullable: true, type: "date" })
  created_at: Date;

  @Column({ nullable: true, type: "date" })
  updated_at: Date;

  @OneToMany(() => CommentEntity, (cmt) => cmt.user)
  comments: CommentEntity[];
}
