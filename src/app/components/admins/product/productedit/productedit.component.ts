import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category';
@Component({
  selector: 'app-productedit',
  imports: [CommonModule, FormsModule],
  templateUrl: './productedit.component.html',
  styleUrl: './productedit.component.scss',
  standalone: true
})


export class ProductEditComponent implements OnInit {
  product: any = {}; // Dữ liệu sản phẩm
  imagePreviews: string[] = []; // Hiển thị ảnh đã chọn
  selectedFiles: File[] = []; // Lưu trữ file ảnh
  categories: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router,
    private categoryService: CategoryService

  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
    this.getCategories(1, 10);
  }

  // Gọi API lấy dữ liệu sản phẩm theo ID
  loadProduct(id: string) {
    this.http.get(`http://localhost:8081/api/v1/library/product/${id}`)
      .subscribe((data: any) => {
        this.product = data;
      }, error => {
        console.error("Lỗi khi tải sản phẩm:", error);
      });
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

  // Gửi dữ liệu cập nhật sản phẩm

  onCategoryChange() {
    // Gán categoryName khi người dùng chọn một danh mục
    const selectedCategory = this.categories.find(cat => String(cat.id) === String(this.product.categoryId));
    if (selectedCategory) {
      this.product.categoryName = selectedCategory.categoryName;
    }
  }

  updateProduct() {
    // Loại bỏ trường images khỏi product trước khi gửi
    const productToUpdate = { ...this.product };
    delete productToUpdate.images;  // Loại bỏ trường images

    console.log("Dữ liệu sản phẩm trước khi gửi: ", productToUpdate);

    this.http.put(`/api/v1/library/product/${this.product.id}`, productToUpdate)
      .subscribe(response => {
        alert("Cập nhật thành công!");
        this.router.navigate(['/products']);
      }, error => {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
      });
  }

}

