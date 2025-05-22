import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ✅ Import ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // ✅ Import FormBuilder & FormGroup
import { Product } from '../../models/product';
import { OrderDTO } from '../../dtos/order/order.dto';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { OrderResponse } from '../../dtos/order/orderRepsonse.dto';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true, // ⚡ Standalone Component
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  cartItems: { product: Product, quantity: number }[] = [];
  totalAmount: number = 0;
  orderForm: FormGroup; // ✅ Reactive Form

  constructor(
    private router: Router,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private fb: FormBuilder, // ✅ Inject FormBuilder,
    private userService: UserService
  ) {
    // ✅ Khởi tạo form với FormBuilder
    this.orderForm = this.fb.group({
      user_id: [1],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      address: ['', Validators.required],
      note: [''],
      payment_method: ['cod', Validators.required],
      shipping_method: ['express', Validators.required],
      coupon_code: [''],
      cart_items: [[]]
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
    debugger
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    const user = this.userService.getUserResponseToLocalStorage();  // Lấy thông tin người dùng từ localStorage
    console.log(user);
    if (user) {
      this.orderForm.patchValue({
        user_id: user.id,
        fullname: user.fullName,
        email: user.email,
        phone_number: user.phone,
        address: user.address
      });
    }
  }
  loadCartItems() {
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys());

    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.appBaseUrl}/product/image/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: cart.get(productId)!
          };
        });
        this.calculateTotal();
      },
      error: (error) => {
        console.error('Lỗi khi lấy sản phẩm:', error);
      }
    });
  }


  placeOrder() {
    if (this.orderForm.invalid) {
      console.error('Form không hợp lệ!');
      return;
    }

    const formValue = this.orderForm.value;
    const orderId = Number(Date.now().toString().slice(-9)); // ✅ Chỉ lấy 9 chữ số cuối
    ;
    const orderData: OrderDTO = {
      id: orderId,
      userId: formValue.user_id,
      fullName: formValue.fullname,
      email: formValue.email,
      phoneNumber: formValue.phone_number,
      address: formValue.address,
      note: formValue.note,
      totalMoney: this.totalAmount,
      shippingMethod: formValue.shipping_method,
      paymentMethod: formValue.payment_method,
      couponCode: formValue.coupon_code,
      cartItems: this.cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };
    const orderDa: OrderResponse = {
      userId: formValue.user_id,
      fullName: formValue.fullname,
      email: formValue.email,
      phoneNumber: formValue.phone_number,
      address: formValue.address,
      note: formValue.note || "", // ✅ Đảm bảo có giá trị mặc định
      couponCode: formValue.coupon_code || "",
      totalMoney: this.totalAmount,
      paymentMethod: formValue.payment_method,
      shippingMethod: formValue.shipping_method
    };


    console.log("Dữ liệu gửi đi:", orderData);
    if (formValue.payment_method === 'online') {
      // Gọi API để tạo Stripe Checkout Session
      this.orderService.placeOrder(orderData).subscribe({
        next: (orderResponse: OrderDTO) => {
          console.log("Đơn hàng đã lưu:", orderResponse);
          localStorage.setItem('latestOrderId', orderResponse.id.toString()); // ✅ Đúng

          this.orderService.createStripeSession(orderData).subscribe({
            next: (response: any) => {
              if (response.checkoutUrl) {

                window.location.href = response.checkoutUrl; // Chuyển hướng đến trang thanh toán Stripe
              } else {
                alert('Không thể tạo phiên thanh toán.');
              }
            },
            error: (error) => {
              alert(`Lỗi khi tạo phiên thanh toán: ${error.message}`);
            }
          });
        },
        error: (error) => {
          alert(`Lỗi khi lưu đơn hàng: ${error.message}`);
        }
      });
    } else {
      // Thanh toán COD - xử lý đặt hàng bình thường
      this.orderService.placeOrder(orderData).subscribe({
        next: () => {
          alert('Đặt hàng thành công!');
          this.cartService.clearCart();
          this.router.navigate(['/']);
        },
        complete: () => {
          this.calculateTotal();
        },
        error: (error) => {
          alert(`Lỗi khi đặt hàng: ${error.message}`);
        }
      });
    }

  }

  // placeOrder() {
  //   if (this.orderForm.invalid) {
  //     console.error('Form không hợp lệ!');
  //     return;
  //   }

  //   const orderData: OrderDTO = this.orderForm.value;
  //   orderData.total_money = this.totalAmount; // Cập nhật tổng tiền

  //   this.orderService.placeOrder(orderData).subscribe({
  //     next: () => {
  //       console.log('Đặt hàng thành công');
  //       this.cartService.clearCart(); // Xóa giỏ hàng
  //       this.cartItems = [];
  //       this.calculateTotal();
  //       this.orderForm.reset(); // Reset form sau khi đặt hàng
  //     },
  //     error: (error) => {
  //       console.error('Lỗi khi đặt hàng:', error);
  //     }
  //   });
  // }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }


}
