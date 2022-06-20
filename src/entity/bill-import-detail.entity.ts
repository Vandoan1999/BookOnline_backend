import { Entity } from "typeorm";

@Entity()
export class BillImportDetail {
  bill_import_id: string;
  book_id: string;
  quantity: number;
}
