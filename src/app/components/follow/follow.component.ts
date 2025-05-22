import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { data } from 'jquery';
import { environment } from '../../environments/environment';
import { OrderStatusPipe } from '../../order-status.pipe';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
@Component({
  selector: 'app-follow',
  standalone: true,
  imports: [CommonModule, FormsModule, OrderStatusPipe, RouterModule],
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.scss']
})
export class FollowComponent implements OnInit {
  orders: any[] = [];
  environment = environment;
  categories: Category[] = [];
  cartItems: { product: Product, quantity: number }[] = [];
  totalAmount: number = 0;
  totalQuantity: number = 0;
  constructor(
    private http: HttpClient,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {

    const user = this.getUserFromLocalStorage();
    if (!user || !user.id) {
      console.error('Không tìm thấy thông tin người dùng hoặc userId không hợp lệ');
      return;
    }

    this.loadOrdersByUserId(user.id);
    this.loadCartItems();
  }
  loadCartItems() {
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys());

    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.appBaseUrl}/product/images/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: cart.get(productId)!
          };
        });
        this.calculateTotal();
        this.calculateTotalQuantity();
      },
      error: (error) => {
        console.error('Lỗi khi lấy sản phẩm:', error);
      }
    });
  }
  calculateTotalQuantity(): void {
    // Tính tổng số lượng sản phẩm trong giỏ hàng
    this.totalQuantity = this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  }
  removeItem(id: number): void {
    this.cartService.removeItem(id); // Gọi hàm từ CartService
    this.loadCartItems();
  }

  private getUserFromLocalStorage(): any | null {
    try {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Lỗi khi parse user từ localStorage:', error);
      return null;
    }
  }

  private loadOrdersByUserId(userId: number): void {
    this.orderService.getOrdersByUserId(userId).subscribe({
      next: (res) => {
        console.log('API Response:', res);

        // Nếu res là mảng -> gán luôn
        if (Array.isArray(res)) {
          this.orders = res;
        }
        // Nếu res có data -> lấy data
        else if (res && Array.isArray(res.data)) {
          this.orders = res.data;
        }
        else {
          console.warn('Không có đơn hàng nào được trả về.');
          this.orders = [];
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy đơn hàng:', err);
      }
    });
  }


}
