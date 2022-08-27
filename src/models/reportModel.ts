export interface TableColumn {
  name: string;
  width?: number;
  child?: {
    name: string;
    width?: number;
    child?: {
      name: string;
      width: number;
    }[];
  }[];
}

export interface TableData<T> {
  userInfo: string;
  data: T[];
}

export interface ReportModel<T> {
  parentCompany: string;
  childCompany: string;
  AddressChildCompany: string;
  reportTitle: string;
  reportTime: string;
  reportDateSignature: string;
  stockerSignature: string;
  creater: string;
  tableColumn: TableColumn[];
  tableData: TableData<T>[];
  footer: Boolean;
  header: Boolean;
  columnLevel: 1 | 3;
}
