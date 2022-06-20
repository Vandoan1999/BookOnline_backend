import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("genres")
export class GenresEntity {
  //thể loại
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, type: "bytea" })
  image: Buffer;

  @Column({ nullable: true, type: "date" })
  created_at: string;

  @Column({ nullable: true, type: "date" })
  updated_at: Date;
}
