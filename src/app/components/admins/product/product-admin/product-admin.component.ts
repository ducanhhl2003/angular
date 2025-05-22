import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';  // Import NgbModal
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../models/product';
import { Category } from '../../../../models/category';
import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Import các module cần thiết
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.scss']
})
export class ProductAdminComponent {

  products: Product[] = [];
  categories: Category[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  selectedCategoryId: number = 0;
  selectedProductIds: number[] = [];

  // Biến liên quan đến modal chọn ảnh
  selectedProduct: Product | null = null;
  selectedImage: string = '';
  imageList: string[] = [];

  @ViewChild('imageModal') imageModal: TemplateRef<any> | undefined;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.getCategories(1, 100);
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (response: any) => {
        if (response && response.listResult) {
          this.categories = response.listResult;
        }
      },
      error: (error) => {
        console.error('Lỗi khi gọi API category:', error);
      }
    });
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    this.productService.getProductAdmin(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        if (response && response.listResult && Array.isArray(response.listResult)) {
          response.listResult.forEach((product: Product) => {
            product.url = `${environment.appBaseUrl}/product/images/${product.thumbnail}`;
          });
          this.products = response.listResult;
          this.totalPages = response.totalPage;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        }
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const visiblePages: number[] = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }

  // Mở modal với ng-bootstrap
  openImageModal(product: Product) {
    this.selectedProduct = product;

    // Đảm bảo rằng bạn sử dụng thumbnail thay vì imageUrl cho ảnh chính
    this.selectedImage = `${environment.appBaseUrl}/product/images/${product.thumbnail}`;

    this.productService.getImagesByProductId(product.id).subscribe({
      next: (images) => {
        // Lấy danh sách các ảnh khác
        this.imageList = images.map(img => `${environment.appBaseUrl}/product/images/${img.imageUrl}`);

        // Mở modal
        this.modalService.open(this.imageModal, {
          size: 'lg',
          backdrop: 'static',
          keyboard: false
        });
      },
      error: (error) => {
        console.error('Lỗi khi tải ảnh:', error);
      }
    });
  }



  selectImage(imageUrl: string) {
    // Cập nhật ảnh chính (thumbnail) thành ảnh được chọn
    this.selectedImage = imageUrl;

    // Nếu bạn muốn lưu lại thumbnail mới vào product:
    if (this.selectedProduct) {
      this.selectedProduct.thumbnail = imageUrl.replace(`${environment.appBaseUrl}/product/images/`, '');
    }


  }

  updateThumbnail(id: number, thumbnail: string) {
    this.productService.updateProductThumbnail(id, thumbnail)
      .subscribe({
        next: () => {
          console.log('Thumbnail đã được cập nhật!');
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật thumbnail:', err);
        }
      });
  }




  saveImage() {
    if (this.selectedProduct && this.selectedImage) {
      this.selectedProduct.url = this.selectedImage;
      // Cập nhật thumbnail trong đối tượng product
      const thumbnail = this.selectedImage.replace(`${environment.appBaseUrl}/product/images/`, '');

      // Gọi API để cập nhật thumbnail vào backend
      this.updateThumbnail(this.selectedProduct.id, thumbnail);

      // Cập nhật thumbnail ngay lập tức trong đối tượng product
      this.selectedProduct.thumbnail = thumbnail;

      // Tùy chọn: Bạn có thể đóng modal sau khi lưu
      this.modalService.dismissAll();
    }
  }

  deleteSelectedProducts() {
    if (this.selectedProductIds.length > 0) {
      this.productService.deleteProducts(this.selectedProductIds).subscribe({
        next: () => {
          this.products = this.products.filter(product => !this.selectedProductIds.includes(product.id));
          console.log('Sản phẩm đã được xóa!');
          // Bạn có thể làm mới danh sách sản phẩm sau khi xóa
        },
        error: (err) => {
          console.error('Lỗi khi xóa sản phẩm:', err);
        }
      });
    } else {
      console.log('Không có sản phẩm nào được chọn để xóa.');
    }
  }

  // Phương thức để chọn/deselect một sản phẩm
  toggleProductSelection(productId: number) {
    const index = this.selectedProductIds.indexOf(productId);
    if (index >= 0) {
      this.selectedProductIds.splice(index, 1);  // Bỏ chọn sản phẩm
    } else {
      this.selectedProductIds.push(productId);  // Chọn sản phẩm
    }
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);

  }
}






// import { Component } from '@angular/core';
// import { CommonModule, NgFor } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Product } from '../../../models/product';
// import { Category } from '../../../models/category';
// import { ProductService } from '../../../services/product.service';
// import { CategoryService } from '../../../services/category.service';
// import { Router } from '@angular/router';
// import { environment } from '../../../environments/environment';
// import { RouterModule } from '@angular/router'; // Thêm dòng này

// @Component({
//   selector: 'app-product-admin',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './product-admin.component.html',
//   styleUrl: './product-admin.component.scss'
// })
// export class ProductAdminComponent {
//   products: Product[] = [];
//   categories: Category[] = [];
//   currentPage: number = 1;
//   itemsPerPage: number = 10;
//   pages: number[] = [];
//   totalPages: number = 0;
//   visiblePages: number[] = [];
//   keyword: string = "";
//   selectedCategoryId: number = 0;

//   constructor(private productService: ProductService,
//     private categoryService: CategoryService,
//     private router: Router
//   ) { }
//   ngOnInit() {
//     // debugger
//     // localStorage.clear();
//     this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
//     this.getCategories(1, 100);
//   }

//   getCategories(page: number, limit: number) {
//     this.categoryService.getCategories(page, limit).subscribe({
//       next: (response: any) => {
//         if (response && response.listResult) {
//           this.categories = response.listResult;
//           console.log('✅ Categories:', this.categories);
//         } else {
//           console.error('⚠️ API response không hợp lệ:', response);
//         }
//       },
//       error: (error) => {
//         console.error('❌ Lỗi khi gọi API category:', error);
//       }
//     });
//   }

//   // getCategories(page: number, limit: number) {
//   //   this.categoryService.getCategories(page, limit).subscribe({
//   //     next: (categories: Category[]) => {
//   //       this.categories = categories;
//   //     },
//   //     complete: () => {
//   //       debugger;
//   //     },
//   //     error: (error: any) => {
//   //       console.error('Error fetching products:', error);
//   //     }
//   //   });
//   // }

//   searchProducts() {
//     this.currentPage = 1;
//     this.itemsPerPage = 12;
//     this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
//   }
//   getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
//     this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
//       next: (response: any) => {
//         if (response && response.listResult && Array.isArray(response.listResult)) {
//           response.listResult.forEach((product: Product) => {
//             product.url = `${environment.appBaseUrl}/product/images/${product.thumbnail}`;
//           });
//           this.products = response.listResult;
//           this.totalPages = response.totalPage; // Sửa thành totalPage
//           this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
//         } else {
//           console.error('Invalid response format:', response);
//         }
//       },
//       complete: () => {
//         // debugger;
//       },
//       error: (error: any) => {
//         console.error('Error fetching products:', error);
//       }
//     });
//   }
//   // getProducts(page: number, limit: number) {
//   //   this.productService.getProducts(page, limit).subscribe({
//   //     next: (response: any) => {
//   //       response.products.forEach((product: Product) => {
//   //         product.url = `${environment.appBaseUrl}/product/images/${product.thumbnail}`;
//   //       });
//   //       this.products = response.products;
//   //       this.totalPages = response.totalPages;
//   //       this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
//   //     },
//   //     complete: () => {
//   //       debugger;
//   //     },
//   //     error: (error: any) => {
//   //       console.error('Error fetching products:', error);
//   //     }
//   //   });
//   // }
//   onPageChange(page: number) {
//     this.currentPage = page;
//     this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
//   }

//   generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
//     const maxVisiblePages = 5;
//     const halfVisiblePages = Math.floor(maxVisiblePages / 2);

//     let startPage = Math.max(currentPage - halfVisiblePages, 1);
//     let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(endPage - maxVisiblePages + 1, 1);
//     }
//     return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
//   }

//   onProductClick(productId: number) {
//     this.router.navigate(['/products', productId])
//   }

// }
