import { Component, OnInit } from '@angular/core';
import { OrderResponse } from '../../dtos/order/orderRepsonse.dto';
import { OrderService } from '../../services/order.service'; // thêm import cho OrderService
import { OrderDetail } from '../../models/orderDetail';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-order-detail',
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'] // sửa thành styleUrls
})
export class OrderDetailComponent implements OnInit {

  orderResponse: OrderResponse = {
    userId: 0,
    fullName: '',
    email: '',
    address: '',
    note: '',
    totalMoney: 0,
    shippingMethod: '',
    paymentMethod: '',
    orderDetails: [],
    phoneNumber: '',
  };

  constructor(
    private orderService: OrderService,
  ) { } // sửa dấu ngoắc nhọn

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails() {
    const orderId = 4;

    this.orderService.getOrderById(orderId).subscribe({
      next: (response: any) => {
        console.log('Dữ liệu API:', response); // Debug dữ liệu API

        if (!response) {
          console.error('Lỗi: response là null hoặc undefined');
          return;
        }

        this.orderResponse = {
          userId: response.userId || 0,
          fullName: response.fullName || '',
          email: response.email || '',
          address: response.address || '',
          note: response.note || '',
          totalMoney: response.totalMoney || 0,
          shippingMethod: response.shippingMethod || '',
          paymentMethod: response.paymentMethod || '',
          phoneNumber: response.phoneNumber || '',
          orderDetails: response.orderDetails && Array.isArray(response.orderDetails)
            ? response.orderDetails.map((orderDetail: OrderDetail) => orderDetail)
            : []
        };
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
      }
    });
  }

}
