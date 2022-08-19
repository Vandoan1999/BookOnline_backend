import { AppDataSource } from "@config/db";
import { BillExportDetailRepository } from "@repos/bill-export-detail.repository";
import { BillImportDetailRepository } from "@repos/bill-import-detail.repository";
import { UserRepository } from "@repos/user.repository";
import { Service } from "typedi";
@Service()
export class DashboardService {
  async initData() {
    const promiseAll: any[] = [];

    promiseAll.push(BillExportDetailRepository.total_revenue());
    promiseAll.push(BillImportDetailRepository.total_spending());
    promiseAll.push(UserRepository.totalCustomer());
    promiseAll.push(BillExportDetailRepository.count());
    const [total_revenue, total_spending, total_customer, total_bill_export] =
      await Promise.all(promiseAll);
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
      FROM  bill_export_detail bed join books b on bed.book_id = b.id 
      GROUP BY date_trunc('month', bed.created_at ) `);

    //revenue: doanh thu
    //total spending: tổng chi tiêu
    //total spending: tổng chi tiêu
    //total profit: tổng lợi nhuận

    return {
      total_revenue: total_revenue.sum_price_export,
      total_spending: total_spending.sum_price_import,
      total_profit:
        Number(total_revenue.sum_price_export) -
        Number(total_spending.sum_price_import),
      total_customer: Number(total_customer.total_user),
      total_bill_export,
      userBroupByMonth,
      totalRevenueBroupByMonth,
    };
  }
}
