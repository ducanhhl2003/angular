import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../../services/order.service';

@Component({
  selector: 'app-orderadmin',
  standalone: true, // ✅ Cần thêm để Angular hiểu đây là Standalone Component
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orderadmin.component.html',
  styleUrls: ['./orderadmin.component.scss'] // ✅ Sửa `styleUrl` thành `styleUrls`
})
export class OrderadminComponent implements OnInit {
  orders: any[] = [];
  keyword: string = '';
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getOrders(this.currentPage, 10, this.keyword).subscribe({
      next: (response) => {
        console.log('Dữ liệu nhận được:', response);
        this.orders = response?.listResult || []; // ✅ Lấy trực tiếp listResult
        this.totalPages = response?.totalPage || 1; // ✅ `totalPage` chứ không phải `totalPages`
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách đơn hàng:', err);
      }
    });
  }


  searchOrders() {
    this.currentPage = 1; // Reset về trang đầu tiên khi tìm kiếm
    this.fetchOrders();
  }

  changePage(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.fetchOrders();
    }
  }
}
