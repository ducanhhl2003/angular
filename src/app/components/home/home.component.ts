import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { LoginComponent } from "../login/login.component";
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { environment } from '../../environments/environment';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { GeminiService } from '../../services/gemini.service';



@Component({
  selector: 'app-home',
  standalone: true, // Cần thêm dòng này
  imports: [LoginComponent, CommonModule, FormsModule, RouterModule, AuthModalComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] // Đúng cú pháp
})
export class HomeComponent implements OnInit {
  hotProducts: Product[] = [];
  products: Product[] = [];
  categories: Category[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  selectedCategoryId: number = 0;
  cartItems: { product: Product, quantity: number }[] = [];
  totalAmount: number = 0;
  totalQuantity: number = 0;
  prompt: string = '';
  answer: string = '';
  showChat = false;





  constructor(private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private cartService: CartService,
    private geminiService: GeminiService

  ) { }
  ngOnInit() {
    // debugger
    // localStorage.clear();
    // this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.getCategories(1, 100);
    this.loadCartItems();
    this.loadHotProducts();
  }
  toggleChat() {
    this.showChat = !this.showChat;
    this.prompt = '';
    this.answer = '';
  }

  submitPrompt() {
    if (!this.prompt.trim()) return;
    this.answer = 'Đang xử lý...';
    this.geminiService.askGemini(this.prompt).subscribe({
      next: res => this.answer = res,
      error: err => this.answer = 'Lỗi: ' + err.message

    });
  }
  loadHotProducts(): void {
    this.productService.getHotProducts().subscribe({
      next: (hotData: Product[]) => {
        this.hotProducts = hotData.map((product: Product) => {
          return {
            ...product,
            url: `${environment.appBaseUrl}/product/images/${product.thumbnail}`
          };
        });
      },
      error: (error) => {
        console.error('Error loading hot products:', error);
      }
    });
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (response: any) => {
        if (response && response.listResult) {
          this.categories = response.listResult;
          console.log('✅ Categories:', this.categories);
        } else {
          console.error('⚠️ API response không hợp lệ:', response);
        }
      },
      error: (error) => {
        console.error('❌ Lỗi khi gọi API category:', error);
      }
    });
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



  // getCategories(page: number, limit: number) {
  //   this.categoryService.getCategories(page, limit).subscribe({
  //     next: (categories: Category[]) => {
  //       this.categories = categories;
  //     },
  //     complete: () => {
  //       debugger;
  //     },
  //     error: (error: any) => {
  //       console.error('Error fetching products:', error);
  //     }
  //   });
  // }

  searchProducts() {
    this.currentPage = 1;
    this.itemsPerPage = 12;
    // this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }
  // getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
  //   this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
  //     next: (response: any) => {
  //       if (response && response.listResult && Array.isArray(response.listResult)) {
  //         response.listResult.forEach((product: Product) => {
  //           product.url = `${environment.appBaseUrl}/product/images/${product.thumbnail}`;
  //         });
  //         this.products = response.listResult;
  //         this.totalPages = response.totalPage; // Sửa thành totalPage
  //         this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
  //       } else {
  //         console.error('Invalid response format:', response);
  //       }
  //     },
  //     complete: () => {
  //       // debugger;
  //     },
  //     error: (error: any) => {
  //       console.error('Error fetching products:', error);
  //     }
  //   });
  // }
  // getProducts(page: number, limit: number) {
  //   this.productService.getProducts(page, limit).subscribe({
  //     next: (response: any) => {
  //       response.products.forEach((product: Product) => {
  //         product.url = `${environment.appBaseUrl}/product/images/${product.thumbnail}`;
  //       });
  //       this.products = response.products;
  //       this.totalPages = response.totalPages;
  //       this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
  //     },
  //     complete: () => {
  //       debugger;
  //     },
  //     error: (error: any) => {
  //       console.error('Error fetching products:', error);
  //     }
  //   });
  // }
  onPageChange(page: number) {
    this.currentPage = page;
    // this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }
    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }

  onProductClick(productId: number) {
    this.router.navigate(['/products', productId])
  }
}
