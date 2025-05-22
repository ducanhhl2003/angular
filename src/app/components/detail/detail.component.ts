import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { ProductImage } from '../../models/product.image';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router'; // Import RouterModule


@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  quantity: number = 1;
  currentImageIndex: number = 0;
  selectedCategoryId: number = 0;
  cartItems: { product: Product, quantity: number }[] = [];
  totalAmount: number = 0;
  totalQuantity: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    // Lấy productId từ URL
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id'); // 'id' là tên param trong route
      if (idParam) {
        this.productId = +idParam;
        this.loadProductDetail();
      }
    });
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
  loadProductDetail(): void {
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {
          console.log('API Response:', response);

          if (response.images && response.images.length > 0) {
            response.images = response.images.map((img: ProductImage) => ({
              ...img,
              imageUrl: `${environment.appBaseUrl}/product/images/${img.imageUrl}`
            }));
          }

          this.product = response;
          console.log('Updated images:', this.product?.images);
          this.showImage(0);
        },
        error: (error: any) => {
          console.error('Error fetching detail:', error);
        }
      });
    } else {
      console.error('Invalid productId:', this.productId);
    }
  }

  showImage(index: number): void {
    if (this.product?.images?.length) {
      this.currentImageIndex = Math.max(0, Math.min(index, this.product.images.length - 1));
    }
  }

  thumbnailClick(index: number) {
    this.currentImageIndex = index;
  }

  nextImage(): void {
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    this.showImage(this.currentImageIndex - 1);
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
    } else {
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null');
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  buyNow(): void {
    console.log('Mua ngay sản phẩm:', this.product);
  }
}























// import { Component, OnInit } from '@angular/core';
// import { HeaderComponent } from '../header/header.component';
// import { FooterComponent } from '../footer/footer.component';
// import { ProductService } from '../../services/product.service';
// import { Product } from '../../models/product';
// import { ProductImage } from '../../models/product.image';
// import { environment } from '../../environments/environment';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { CartService } from '../../services/cart.service';

// @Component({
//   selector: 'app-detail',
//   standalone: true,
//   imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule, HttpClientModule],
//   templateUrl: './detail.component.html',
//   styleUrl: './detail.component.scss'
// })
// export class DetailComponent implements OnInit {
//   product?: Product;
//   productId: number = 0;
//   quantity: number = 1;
//   currentImageIndex: number = 0;

//   constructor(private productService: ProductService, private cartService: CartService) { }

//   ngOnInit() {
//     // debugger
//     // this.cartService.clearCart();
//     const idParam = 9; // Giả sử lấy ID từ route hoặc params
//     this.productId = +idParam;

//     if (!isNaN(this.productId)) {
//       this.productService.getDetailProduct(this.productId).subscribe({
//         next: (response: any) => {
//           console.log('API Response:', response);

//           if (response.images && response.images.length > 0) {
//             response.images = response.images.map((img: ProductImage) => ({
//               ...img,
//               imageUrl: `${environment.appBaseUrl}/product/images/${img.imageUrl}`
//             }));
//           }

//           this.product = response;
//           console.log('Updated images:', this.product?.images);
//           this.showImage(0);
//         },
//         error: (error: any) => {
//           console.error('Error fetching detail:', error);
//         }
//       });
//     } else {
//       console.error('Invalid productId:', idParam);
//     }
//   }

//   showImage(index: number): void {
//     if (this.product?.images?.length) {
//       this.currentImageIndex = Math.max(0, Math.min(index, this.product.images.length - 1));
//     }
//   }

//   thumbnailClick(index: number) {
//     this.currentImageIndex = index;
//   }

//   nextImage(): void {
//     this.showImage(this.currentImageIndex + 1);
//   }

//   previousImage(): void {
//     this.showImage(this.currentImageIndex - 1);
//   }

//   addToCart(): void {
//     debugger
//     if (this.product) {
//       this.cartService.addToCart(this.product.id, this.quantity);
//     }
//     else {
//       console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null');
//     }
//   }

//   increaseQuantity(): void {
//     this.quantity++;
//   }
//   decreaseQuantity(): void {
//     if (this.quantity > 1) {
//       this.quantity--;
//     }
//   }
//   buyNow(): void {

//   }
// }



// // import { Component, OnInit } from '@angular/core';
// // import { HeaderComponent } from '../header/header.component';
// // import { FooterComponent } from '../footer/footer.component';
// // import { Product } from '../../models/product';
// // import { ProductService } from '../../services/product.service';
// // import { ProductImage } from '../../models/product.image';
// // import { environment } from '../../environments/environment';
// // import { CommonModule, NgFor } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { HttpClientModule } from '@angular/common/http';
// // @Component({
// //   selector: 'app-detail',
// //   standalone: true,
// //   imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule, HttpClientModule],
// //   templateUrl: './detail.component.html',
// //   styleUrl: './detail.component.scss'
// // })
// // export class DetailComponent implements OnInit {
// //   product?: Product;
// //   productId: number = 0;
// //   currentImageIndex: number = 0;
// //   constructor(
// //     private productService: ProductService,
// //   ) { }
// //   ngOnInit() {
// //     const idParam = 10;
// //     if (idParam !== null) {
// //       this.productId = +idParam;
// //     }
// //     if (!isNaN(this.productId)) {
// //       this.productService.getDetailProduct(this.productId).subscribe({
// //         next: (response: any) => {
// //           console.log('API Response:', response); // Kiểm tra dữ liệu trả về
// //           if (response.product_images && response.product_images.length > 0) {
// //             response.product_images = response.product_images.map((img: ProductImage) => ({
// //               ...img,
// //               image_url: `${environment.appBaseUrl}/product/images/${img.image_url}`
// //             }));
// //           }
// //           this.product = response;
// //           console.log('Updated images:', this.product?.product_images); // Kiểm tra URL ảnh
// //           this.showImage(0);
// //         },
// //         complete() {

// //         },
// //         error: (error: any) => {
// //           console.error('Error fetching detail:', error);
// //         }
// //       });
// //     }
// //     else {
// //       console.error('Invalid productId:', idParam);
// //     }
// //   }
// //   showImage(index: number): void {
// //     if (this.product && this.product.product_images && this.product.product_images.length > 0) {
// //       if (index < 0) {
// //         index = 0;
// //       }
// //       else if (index >= this.product.product_images.length) {
// //         index = this.product.product_images.length - 1;
// //       }
// //       this.currentImageIndex = index;
// //     }
// //   }
// //   thumbnailClick(index: number) {
// //     this.currentImageIndex = index;
// //   }
// //   nextImage(): void {
// //     this.showImage(this.currentImageIndex + 1);
// //   }
// //   previousImage(): void {
// //     this.showImage(this.currentImageIndex - 1);
// //   }
// // }
