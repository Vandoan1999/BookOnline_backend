import { ImageType } from "@enums/image-type.enum";
import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity("images")
export class ImageEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  link: string;
}
