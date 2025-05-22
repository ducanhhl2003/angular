import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category';

@Component({
  selector: 'app-productcreate',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './productcreate.component.html',
  styleUrls: ['./productcreate.component.scss']
})
export class ProductCreateComponent {
  @ViewChild('productForm') productForm!: NgForm;

  product = {
    name: '',
    price: 0,
    thumbnail: '',
    description: '',
    categoryName: ''
  };

  selectedFiles: File[] = []; // Change to handle multiple files
  imagePreviews: string[] = []; // Array to store multiple image previews
  categories: Category[] = [];

  constructor(
    public router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.getCategories(1, 10);
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (response: any) => {
        if (response && response.listResult) {
          this.categories = response.listResult;
        } else {
          console.error('⚠️ API response không hợp lệ:', response);
        }
      },
      error: (error) => {
        console.error('❌ Lỗi khi gọi API category:', error);
      }
    });
  }

  // Handle multiple file selection and image preview
  onFilesChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      // Update selected files array with multiple files
      this.selectedFiles = Array.from(event.target.files);

      // Generate image previews for each file
      this.imagePreviews = [];
      this.selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // Upload images and create the product
  uploadImagesAndCreateProduct() {
    if (!this.product.name.trim() || this.product.price <= 0) {
      alert('Vui lòng nhập tên sản phẩm và giá hợp lệ!');
      return;
    }

    if (this.selectedFiles.length === 0) {
      alert('Vui lòng chọn ít nhất một ảnh!');
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    this.productService.createProduct(this.product).subscribe({
      next: (response: any) => {
        const productId = response.id; // Assuming the product ID is returned from the createProduct API
        console.log('Product created:', response);

        this.productService.uploadImage(productId, formData).subscribe({
          next: (uploadResponse) => {
            console.log('Images uploaded successfully:', uploadResponse);
            this.product.thumbnail = uploadResponse.thumbnail; // You can choose to update with the first image or process them differently
            alert('Sản phẩm đã được tạo thành công!');
            this.router.navigate(['/products']);
          },
          error: (error) => {
            console.error('Lỗi tải ảnh:', error);
            alert('Lỗi tải ảnh: ' + error.error);
          }
        });
      },
      error: (error: any) => {
        console.error('Lỗi khi tạo sản phẩm:', error);
        alert(`Lỗi: ${error.error.message}\nChi tiết: ${JSON.stringify(error.error.data)}`);
      }
    });
  }
}

// import { Component, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, NgForm } from '@angular/forms';
// import { Router } from '@angular/router';
// import { RouterModule } from '@angular/router';
// import { ProductService } from '../../../services/product.service';
// import { CategoryService } from '../../../services/category.service';
// import { Category } from '../../../models/category';

// @Component({
//   selector: 'app-productcreate',
//   standalone: true,
//   imports: [FormsModule, CommonModule, RouterModule],
//   templateUrl: './productcreate.component.html',
//   styleUrls: ['./productcreate.component.scss']
// })
// export class ProductCreateComponent {
//   @ViewChild('productForm') productForm!: NgForm;

//   product = {
//     name: '',
//     price: 0,
//     thumbnail: '',
//     description: '',
//     categoryName: ''
//   };
//   selectedFile: File | null = null;
//   imagePreview: string | null = null; // Add this property to store image preview
//   categories: Category[] = [];

//   constructor(
//     public router: Router,
//     private productService: ProductService,
//     private categoryService: CategoryService
//   ) { }

//   ngOnInit() {
//     this.getCategories(1, 10);
//   }

//   getCategories(page: number, limit: number) {
//     this.categoryService.getCategories(page, limit).subscribe({
//       next: (response: any) => {
//         if (response && response.listResult) {
//           this.categories = response.listResult;
//         } else {
//           console.error('⚠️ API response không hợp lệ:', response);
//         }
//       },
//       error: (error) => {
//         console.error('❌ Lỗi khi gọi API category:', error);
//       }
//     });
//   }

//   // Handle file selection and image preview
//   onFileChange(event: any) {
//     if (event.target.files && event.target.files.length > 0) {
//       this.selectedFile = event.target.files[0]; // Chỉ lấy file đầu tiên

//       // Hiển thị ảnh xem trước
//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         this.imagePreview = e.target.result;
//       };

//       // 🔥 Kiểm tra nếu selectedFile không null trước khi gọi readAsDataURL()
//       if (this.selectedFile instanceof Blob) {
//         reader.readAsDataURL(this.selectedFile);
//       }
//     }
//   }


//   // Upload image and create the product
//   uploadImageAndCreateProduct() {
//     if (!this.product.name.trim() || this.product.price <= 0) {
//       alert('Vui lòng nhập tên sản phẩm và giá hợp lệ!');
//       return;
//     }

//     if (!this.selectedFile) {
//       alert('Vui lòng chọn một ảnh!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('files', this.selectedFile);

//     this.productService.createProduct(this.product).subscribe({
//       next: (response: any) => {
//         const productId = response.id; // Assuming the product ID is returned from the createProduct API
//         console.log('Product created:', response);
//         this.productService.uploadImage(productId, formData).subscribe({
//           next: (uploadResponse) => {
//             console.log('Image uploaded successfully:', uploadResponse);
//             this.product.thumbnail = uploadResponse.thumbnail; // Update the thumbnail with the returned URL
//             alert('Sản phẩm đã được tạo thành công!');
//             this.router.navigate(['/products']);
//           },
//           error: (error) => {
//             console.error('Lỗi tải ảnh:', error);
//             alert('Lỗi tải ảnh: ' + error.error);
//           }
//         });
//       },
//       error: (error: any) => {
//         console.error('Lỗi khi tạo sản phẩm:', error);
//         alert(`Lỗi: ${error.error.message}\nChi tiết: ${JSON.stringify(error.error.data)}`);
//       }
//     });
//   }
// }
