import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent implements OnInit {
  orderId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    // Lấy orderId từ query params
    debugger
    this.orderId = Number(localStorage.getItem('latestOrderId'));

    if (this.orderId) {
      // Gọi API cập nhật trạng thái đơn hàng thành "PAID"
      this.orderService.updateOrderStatus(this.orderId, 'SHIPPED').subscribe({
        next: () => {
          console.log('Cập nhật trạng thái đơn hàng thành công!');
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật đơn hàng:', error);
        }
      });
    }
    // localStorage.removeItem('latestOrderId');
    this.cartService.clearCart();
  }
}
