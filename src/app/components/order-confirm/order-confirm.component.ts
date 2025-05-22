import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-order-confirm',
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './order-confirm.component.html',
  styleUrl: './order-confirm.component.scss'
})
export class OrderConfirmComponent implements OnInit {
  cartItems: { product: Product, quantity: number }[] = [];
  totalAmount: number = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private userService: UserService,

  ) { }
  ngOnInit(): void {
    debugger
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys());

    debugger

    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        debugger
        this.cartItems = productIds.map((productId) => {
          debugger
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.appBaseUrl}/product/images/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: cart.get(productId)!
          };

        })
      },
      complete: () => {
        this.calculateTotal()
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail', error);
      }
    });
  }
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  }
  onCheckOut() {
    const userResponse = this.userService.getUserResponseToLocalStorage();
    const userId = userResponse ? userResponse.id : null; // Giả sử `id` là userId

    if (userId) {
      this.router.navigate(['/orders', userId]);
    } else {
      console.error('User not logged in');
    }
  }
}
