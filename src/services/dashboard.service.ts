import { AppDataSource } from "@config/db";
import { BillExportDetailRepository } from "@repos/bill-export-detail.repository";
import { BillExportRepository } from "@repos/bill-export.repository";
import { BillImportDetailRepository } from "@repos/bill-import-detail.repository";
import { UserRepository } from "@repos/user.repository";
import { Service } from "typedi";
@Service()
export class DashboardService {
  async initData() {
    const promiseAll: any[] = [];

    promiseAll.push(BillExportRepository.total_revenue());
    promiseAll.push(BillImportDetailRepository.total_spending());
    promiseAll.push(UserRepository.totalCustomer());
    promiseAll.push(BillExportRepository.total_bill_delivered());
    promiseAll.push(BillExportRepository.total_bill_confirmed());
    promiseAll.push(BillExportRepository.total_bill_pending());
    promiseAll.push(BillExportRepository.total_bill_rejected());
    const [
      total_revenue,
      total_spending,
      total_customer,
      total_bill_delivered,
      total_bill_confirmed,
      total_bill_pending,
      total_bill_rejected,
    ] = await Promise.all(promiseAll);
    const userBroupByMonth = await AppDataSource.query(`
      SELECT
      date_trunc('month', u.created_at ) AS "date",
      COUNT(u.id) AS user_created
      FROM  users u
      GROUP BY date_trunc('month', u.created_at ) `);

    const totalRevenueBroupByMonth = await AppDataSource.query(`
      SELECT
      date_trunc('month', bed.created_at ) AS "date",
      SUM(b.price_export * bed.quantity) AS total_revenue
      FROM  bill_export be 
      join bill_export_detail bed on be.id  = bed.bill_export_id 
      join books b on bed.book_id = b.id 
      where be.status = '2'
      GROUP BY date_trunc('month', bed.created_at) `);

    //revenue: doanh thu
    //total spending: tổng chi tiêu
    //total spending: tổng chi tiêu
    //total profit: tổng lợi nhuận

    return {
      total_revenue: total_revenue.sum_price_export,
      total_spending: total_spending.sum_price_import || 0,
      total_profit: total_revenue.sum_profit,
      total_customer: Number(total_customer.total_user),
      total_bill_export: Number(total_bill_delivered.total),
      total_bill_pending: Number(total_bill_pending.total),
      total_bill_confirmed: Number(total_bill_confirmed.total),
      total_bill_rejected: Number(total_bill_rejected.total),
      userBroupByMonth,
      totalRevenueBroupByMonth,
    };
  }
}
