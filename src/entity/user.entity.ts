import { Gender } from "@enums/gender.enum";
import { Role } from "@enums/role.enum";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Users {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  name: string;

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

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  is_pass_change: boolean;

  @Column({ nullable: true })
  is_block: boolean;

  @Column({ nullable: true })
  created_at: Date;

  @Column({ nullable: true })
  updated_at: Date;
}
