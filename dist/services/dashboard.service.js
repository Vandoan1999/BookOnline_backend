"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const db_1 = require("@config/db");
const bill_export_repository_1 = require("@repos/bill-export.repository");
const bill_import_detail_repository_1 = require("@repos/bill-import-detail.repository");
const user_repository_1 = require("@repos/user.repository");
const typedi_1 = require("typedi");
let DashboardService = class DashboardService {
    initData() {
        return __awaiter(this, void 0, void 0, function* () {
            const promiseAll = [];
            promiseAll.push(bill_export_repository_1.BillExportRepository.total_revenue());
            promiseAll.push(bill_import_detail_repository_1.BillImportDetailRepository.total_spending());
            promiseAll.push(user_repository_1.UserRepository.totalCustomer());
            promiseAll.push(bill_export_repository_1.BillExportRepository.total_bill_delivered());
            promiseAll.push(bill_export_repository_1.BillExportRepository.total_bill_confirmed());
            promiseAll.push(bill_export_repository_1.BillExportRepository.total_bill_pending());
            promiseAll.push(bill_export_repository_1.BillExportRepository.total_bill_rejected());
            const [total_revenue, total_spending, total_customer, total_bill_delivered, total_bill_confirmed, total_bill_pending, total_bill_rejected,] = yield Promise.all(promiseAll);
            const userBroupByMonth = yield db_1.AppDataSource.query(`
      SELECT
      date_trunc('month', u.created_at ) AS "date",
      COUNT(u.id) AS user_created
      FROM  users u
      GROUP BY date_trunc('month', u.created_at ) `);
            const totalRevenueBroupByMonth = yield db_1.AppDataSource.query(`
      SELECT
      date_trunc('month', bed.created_at ) AS "date",
      SUM((b.price_export - b.price_import)  * bed.quantity) AS total_revenue
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
        });
    }
};
DashboardService = __decorate([
    (0, typedi_1.Service)()
], DashboardService);
exports.DashboardService = DashboardService;
