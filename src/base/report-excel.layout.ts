import { ReportModel, TableColumn } from "@models/reportModel";
import * as ExcelJS from "exceljs";
import { COLOR, EXCEL_COLUMN, FONT_NAME } from "../ultis/constant";
export const generateTable = async (
  model: ReportModel<any>,
  fileName: string
) => {
  const path = process.cwd() + "/upload/";
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(model.reportTitle, {
    views: [{ showGridLines: false }],
    pageSetup: {
      orientation: "portrait",
      fitToPage: true,
      margins: {
        left: 0.25,
        right: 0.25,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
    },
    properties: { tabColor: { argb: "6B5B95" }, defaultRowHeight: 18.75 },
  });
  const font = {
    name: FONT_NAME,
    color: { argb: COLOR },
    bold: true,
    size: 10,
  };
  let index = 1;
  model.tableColumn.forEach((column_lv1) => {
    if (!column_lv1.child) {
      worksheet.getColumn(index).width = column_lv1.width;
      index++;
    } else {
      if (column_lv1.child[0]?.child) {
        column_lv1.child.forEach((column_lv2) => {
          column_lv2.child?.forEach((column_lv3) => {
            worksheet.getColumn(index).width = column_lv3.width;
            index++;
          });
        });
      } else {
        column_lv1.child.forEach((column_lv2) => {
          worksheet.getColumn(index).width = column_lv2.width;
          index++;
        });
      }
    }
  });
  //header
  if (model.header) {
    if (model.columnLevel !== 1) {
      worksheet.mergeCells(`A4:${EXCEL_COLUMN[index - 1]}4`);
      worksheet.mergeCells(`A5:${EXCEL_COLUMN[index - 1]}5`);
    } else {
      const lengthColumn = model.tableColumn.length;
      worksheet.mergeCells(`A4:${EXCEL_COLUMN[lengthColumn - 1]}4`);
      worksheet.mergeCells(`A5:${EXCEL_COLUMN[lengthColumn - 1]}5`);
    }
    worksheet.getRow(1).height = 15;
    worksheet.getRow(2).height = 15;
    worksheet.getRow(3).height = 27;
    worksheet.getRow(4).height = 36.75;
    const alignment: any = {
      horizontal: "left",
      vertical: "middle",
      wrapText: true,
    };
    worksheet.mergeCells("A1:E1");
    worksheet.mergeCells("A2:E2");
    worksheet.mergeCells("A3:E3");
    worksheet.getCell("A1").value = model.parentCompany;
    worksheet.getCell("A1").font = font;
    worksheet.getCell("A1").alignment = alignment;
    worksheet.getCell("A2").value = model.childCompany;
    worksheet.getCell("A2").font = font;
    worksheet.getCell("A2").alignment = alignment;
    worksheet.getCell("A3").value = model.AddressChildCompany;
    worksheet.getCell("A3").font = font;
    worksheet.getCell("A3").alignment = alignment;
    //title
    const alignmentTitle: any = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    const fontTitle: any = {
      name: FONT_NAME,
      color: { argb: COLOR },
      bold: true,
      size: 14,
    };
    const titleCell = worksheet.getCell("A4");
    titleCell.value = model.reportTitle;
    titleCell.font = fontTitle;
    titleCell.alignment = alignmentTitle;
    const reportTimeCell = worksheet.getCell("A5");
    reportTimeCell.value = model.reportTime;
    reportTimeCell.font = font;
    reportTimeCell.alignment = alignmentTitle;
  }
  let rowIndex = model.header ? 7 : 1;
  generateColumnTable(
    worksheet,
    model.tableColumn,
    rowIndex,
    model.columnLevel
  );

  rowIndex += model.columnLevel;
  model.tableData.forEach((data) => {
    worksheet.getCell(`A${rowIndex}`).value = data.userInfo;
    rowIndex++;
    data.data.forEach((item) => {
      Object.values(item).forEach((value: any, index) => {
        const currenCell = worksheet.getCell(
          `${EXCEL_COLUMN[index] + rowIndex}`
        );

        if (typeof value == "number") {
          value = value.toString();
        }
        currenCell.value = value;
        currenCell.font = {
          name: FONT_NAME,
          color: { argb: COLOR },
          size: 9,
        };
        if (index === 0) {
          currenCell.alignment = {
            wrapText: true,
            horizontal: "center",
            vertical: "bottom",
          };
        }
        currenCell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
      rowIndex++;
    });
  });
  rowIndex++;
  if (model.footer) {
    if (model.columnLevel == 1) {
      const lengthColumn = model.tableColumn.length;
      let cellMerged = "";
      if (lengthColumn > 10) {
        cellMerged = EXCEL_COLUMN[lengthColumn - 4] + rowIndex;
        worksheet.mergeCells(
          `${EXCEL_COLUMN[lengthColumn - 4] + rowIndex}:${
            EXCEL_COLUMN[lengthColumn - 3] + rowIndex
          }`
        );
        worksheet.mergeCells(
          `${EXCEL_COLUMN[lengthColumn - 4] + (rowIndex + 2)}:${
            EXCEL_COLUMN[lengthColumn - 3] + (rowIndex + 2)
          }`
        );
      }
      if (lengthColumn < 10) {
        cellMerged = EXCEL_COLUMN[lengthColumn - 3] + rowIndex;

        worksheet.mergeCells(
          `${EXCEL_COLUMN[lengthColumn - 3] + rowIndex}:${
            EXCEL_COLUMN[lengthColumn - 1] + rowIndex
          }`
        );
        worksheet.mergeCells(
          `${EXCEL_COLUMN[lengthColumn - 3] + (rowIndex + 2)}:${
            EXCEL_COLUMN[lengthColumn - 1] + (rowIndex + 2)
          }`
        );
      }
      //footer
      const reportDateSignatureCell = worksheet.getCell(cellMerged);
      reportDateSignatureCell.value = model.reportDateSignature;
      reportDateSignatureCell.font = {
        name: FONT_NAME,
        color: { argb: COLOR },
        size: 9,
        italic: true,
      };
      reportDateSignatureCell.alignment = {
        wrapText: true,
        horizontal: "center",
        vertical: "middle",
      };

      const stockerSignatureCell = worksheet.getCell(
        `${cellMerged[0] + (rowIndex + 2)}`
      );
      stockerSignatureCell.value = model.stockerSignature;
      stockerSignatureCell.font = {
        name: FONT_NAME,
        color: { argb: COLOR },
        size: 9,
        bold: true,
      };
      stockerSignatureCell.alignment = {
        wrapText: true,
        horizontal: "center",
        vertical: "middle",
      };
      let indexCell = EXCEL_COLUMN.findIndex((i) => i == cellMerged[0]);
      const createrCell = EXCEL_COLUMN[indexCell - 2] + (rowIndex + 2);
      worksheet.getCell(createrCell).value = model.creater;
      worksheet.getCell(createrCell).font = {
        name: FONT_NAME,
        color: { argb: COLOR },
        size: 9,
        bold: true,
      };
      worksheet.getCell(createrCell).alignment = {
        wrapText: true,
        horizontal: "center",
        vertical: "middle",
      };
    }
  }

  // await workbook.xlsx.writeFile(path + `${fileName}.xlsx`);
  return workbook.xlsx.writeBuffer();
};

const generateColumnTable = (
  worksheet: ExcelJS.Worksheet,
  tableColumn: TableColumn[],
  cellIndex: number,
  columnLevel: number
) => {
  const configColumn: any = {
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "d6d6d6" },
    },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
    font: {
      name: FONT_NAME,
      color: { argb: COLOR },
      size: 9,
      bold: true,
    },
    alignment: {
      wrapText: true,
      horizontal: "center",
      vertical: "bottom",
    },
  };
  if (columnLevel === 1) {
    worksheet.getRow(cellIndex).height = 36;

    tableColumn.forEach((column, index: number) => {
      if (column.child) {
        column.child.forEach((childColum) => {
          if (childColum.child) {
            childColum.child.forEach((chilChildColum) => {});
          }
        });
      }
      const currenCell = worksheet.getCell(
        `${EXCEL_COLUMN[index] + cellIndex}`
      );
      currenCell.value = column.name;
      currenCell.fill = configColumn.fill;
      currenCell.border = configColumn.border;
      currenCell.font = configColumn.font;
      currenCell.alignment = configColumn.alignment;
    });
  } else {
    let columnIndex = 0;

    tableColumn.forEach((column_lv1) => {
      if (!column_lv1.child) {
        const cellTobeMerge = `${EXCEL_COLUMN[columnIndex] + cellIndex}:${
          EXCEL_COLUMN[columnIndex] + (cellIndex + 2)
        }`;
        worksheet.mergeCells(cellTobeMerge);
        const cellLv1 = worksheet.getCell(cellTobeMerge);
        cellLv1.value = column_lv1.name;
        cellLv1.fill = configColumn.fill;
        cellLv1.border = configColumn.border;
        cellLv1.font = configColumn.font;
        cellLv1.alignment = configColumn.alignment;
        columnIndex++;
      } else {
        if (column_lv1.child[0]?.child) {
          let numberChild = 0;
          column_lv1.child.forEach((column_lv2) => {
            column_lv2.child?.forEach((column_lv3) => {
              numberChild++;
            });
          });
          //MERGER LV1
          const cellTobeMerge = `${EXCEL_COLUMN[columnIndex] + cellIndex}:${
            EXCEL_COLUMN[columnIndex + numberChild - 1] + cellIndex
          }`;
          worksheet.mergeCells(cellTobeMerge);
          const cellLv1 = worksheet.getCell(cellTobeMerge);
          cellLv1.value = column_lv1.name;
          cellLv1.fill = configColumn.fill;
          cellLv1.border = configColumn.border;
          cellLv1.font = configColumn.font;
          cellLv1.alignment = configColumn.alignment;

          //MERGER LV2
          let currentColumnIndex_lv2 = columnIndex;
          column_lv1.child.forEach((column_lv2: any) => {
            const cellTobeMerge = `${
              EXCEL_COLUMN[currentColumnIndex_lv2] + (cellIndex + 1)
            }:${
              EXCEL_COLUMN[
                currentColumnIndex_lv2 + (column_lv2.child.length - 1)
              ] +
              (cellIndex + 1)
            }`;
            currentColumnIndex_lv2 += column_lv2.child.length;

            worksheet.mergeCells(cellTobeMerge);
            const cellLv2 = worksheet.getCell(cellTobeMerge);
            cellLv2.value = column_lv2.name;
            cellLv2.fill = configColumn.fill;
            cellLv2.border = configColumn.border;
            cellLv2.font = configColumn.font;
            cellLv2.alignment = configColumn.alignment;
          });
          //MERGER LV3
          let currentColumnIndex_lv3 = columnIndex;
          column_lv1.child.forEach((column_lv2) => {
            column_lv2.child?.forEach((column_lv3) => {
              const cell_lv3 = worksheet.getCell(
                `${EXCEL_COLUMN[currentColumnIndex_lv3] + (cellIndex + 2)}`
              );
              cell_lv3.value = column_lv3.name;
              cell_lv3.fill = configColumn.fill;
              cell_lv3.border = configColumn.border;
              cell_lv3.font = configColumn.font;
              cell_lv3.alignment = configColumn.alignment;
              currentColumnIndex_lv3++;
            });
          });

          columnIndex += numberChild;
        } else {
          const cellTobeMerge = `${EXCEL_COLUMN[columnIndex] + cellIndex}:${
            EXCEL_COLUMN[columnIndex + column_lv1.child.length - 1] +
            (cellIndex + 1)
          }`;

          worksheet.mergeCells(cellTobeMerge);
          const cellLv2 = worksheet.getCell(cellTobeMerge);
          cellLv2.value = column_lv1.name;
          cellLv2.fill = configColumn.fill;
          cellLv2.border = configColumn.border;
          cellLv2.font = configColumn.font;
          cellLv2.alignment = configColumn.alignment;
          columnIndex += column_lv1.child.length;

          column_lv1.child.forEach((column_lv2, index) => {
            const cellLv2 = worksheet.getCell(
              EXCEL_COLUMN[columnIndex - index - 1] + (cellIndex + 2)
            );
            cellLv2.value = column_lv2.name;
            cellLv2.fill = configColumn.fill;
            cellLv2.border = configColumn.border;
            cellLv2.font = configColumn.font;
            cellLv2.alignment = configColumn.alignment;
          });
        }
      }
    });
  }
};
