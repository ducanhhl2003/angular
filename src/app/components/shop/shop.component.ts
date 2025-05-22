import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LoginComponent, AuthModalComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 0;
  keyword: string = "";
  selectedCategoryId: number = 0;
  minPrice: number = 0;
  maxPrice: number = 100000000;  // Giới hạn giá tối đa, có thể thay đổi theo yêu cầu
  cartItems: { product: Product, quantity: number }[] = [];
  totalAmount: number = 0;
  totalQuantity: number = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit() {
    debugger
    this.getProducts();
    this.getCategories(1, 100);
    this.loadCartItems();
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (response: any) => {
        if (response && response.listResult) {
          this.categories = response.listResult;
        }
      },
      error: (error) => console.error('Error fetching categories:', error)
    });
  }

  loadCartItems() {
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys());

    if (productIds.length === 0) {
      this.cartItems = [];
      this.totalAmount = 0;
      this.totalQuantity = 0;
      return;
    }

    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        this.cartItems = productIds.map((productId) => {
          const product = products.find(p => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.appBaseUrl}/product/images/${product.thumbnail}`;
          }
          return { product: product!, quantity: cart.get(productId)! };
        });
        this.calculateTotal();
        this.calculateTotalQuantity();
      },
      error: (error) => console.error('Error fetching cart items:', error)
    });
  }

  // loadCartItems() {
  //   const cart = this.cartService.getCart();
  //   const productIds = Array.from(cart.keys());
  //   this.productService.getProductsByIds(productIds).subscribe({
  //     next: (products) => {
  //       this.cartItems = productIds.map((productId) => {
  //         const product = products.find(p => p.id === productId);
  //         if (product) {
  //           product.thumbnail = `${environment.appBaseUrl}/product/images/${product.thumbnail}`;
  //         }
  //         return { product: product!, quantity: cart.get(productId)! };
  //       });
  //       this.calculateTotal();
  //       this.calculateTotalQuantity();
  //     },
  //     error: (error) => console.error('Error fetching cart items:', error)
  //   });
  // }

  calculateTotalQuantity() {
    this.totalQuantity = this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  calculateTotal() {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  removeItem(id: number) {
    this.cartService.removeItem(id);
    this.loadCartItems();
  }

  searchProducts() {
    this.currentPage = 1;
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.minPrice,
      this.maxPrice,
      this.currentPage,
      this.itemsPerPage,
    ).subscribe({
      next: (response: any) => {
        if (response && response.listResult && Array.isArray(response.listResult)) {
          response.listResult.forEach((product: Product) => {
            product.url = `${environment.appBaseUrl}/product/images/${product.thumbnail}`;
          });
          this.products = response.listResult;
          this.totalPages = response.totalPage;
        }
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
      }
    });
  }


  onPageChange(page: number) {
    this.currentPage = page;
    this.getProducts();
  }

  onProductClick(productId: number) {
    this.router.navigate(['/products', productId]);
  }
}



