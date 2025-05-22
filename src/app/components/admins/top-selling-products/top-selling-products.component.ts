import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatisticsService } from '../../../services/statistics.service';
import { TopSellingProduct } from '../../../models/top-selling-product';
import { Chart, LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend, BarController } from 'chart.js'; // Nhập các thành phần cần thiết

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-top-selling-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './top-selling-products.component.html'
})
export class TopSellingProductsComponent implements OnInit, OnDestroy {
  products: TopSellingProduct[] = [];
  selectedMonth: number;
  selectedYear: number;
  private chartInstance: Chart | null = null; // Khai báo chartInstance là một thuộc tính của component

  months = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' }
  ];

  years: number[] = [];

  constructor(private statisticsService: StatisticsService) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) {
      this.years.push(y);
    }

    this.selectedMonth = new Date().getMonth() + 1;
    this.selectedYear = currentYear;
  }

  ngOnInit(): void {
    Chart.register(LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend, BarController); // Đăng ký các thành phần cần thiết
    this.loadTopProducts();
  }

  ngOnDestroy(): void {
    // Hủy chartInstance khi component bị hủy để tránh rò rỉ bộ nhớ
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  loadTopProducts(): void {
    this.statisticsService
      .getTopSellingProductsByMonth(this.selectedMonth, this.selectedYear)
      .subscribe({
        next: (res) => {
          this.products = res;
          this.renderChart(); // Vẽ biểu đồ sau khi tải dữ liệu
        },
        error: (err) => {
          console.error('Lỗi khi tải dữ liệu sản phẩm bán chạy:', err);
        }
      });
  }

  renderChart(): void {
    const productNames = this.products.map(p => p.productName);
    const totalSold = this.products.map(p => p.totalSold);

    // Đảm bảo phần tử canvas tồn tại và có context hợp lệ
    const canvas = document.getElementById('revenue-chart-canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      console.error('Không tìm thấy phần tử canvas');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Không thể lấy context của canvas');
      return;
    }

    // Hủy chart cũ nếu tồn tại trước khi tạo chart mới
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // Tạo chart mới và lưu nó vào chartInstance
    this.chartInstance = new Chart(ctx, {
      type: 'bar', // Sử dụng 'bar' cho biểu đồ cột
      data: {
        labels: productNames,
        datasets: [{
          label: 'Số lượng bán',
          data: totalSold,
          backgroundColor: 'rgba(54, 162, 235, 0.2)', // Màu cột
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { StatisticsService } from '../../../services/statistics.service';
// import { TopSellingProduct } from '../../../models/top-selling-product';
// import { Chart, LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend, BarController } from 'chart.js'; // Nhập các thành phần cần thiết

// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-top-selling-products',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './top-selling-products.component.html'
// })
// export class TopSellingProductsComponent implements OnInit, OnDestroy {
//   products: TopSellingProduct[] = [];
//   selectedMonth: number;
//   selectedYear: number;
//   private chartInstance: Chart | null = null; // Khai báo chartInstance là một thuộc tính của component

//   months = [
//     { value: 1, label: 'Tháng 1' },
//     { value: 2, label: 'Tháng 2' },
//     { value: 3, label: 'Tháng 3' },
//     { value: 4, label: 'Tháng 4' },
//     { value: 5, label: 'Tháng 5' },
//     { value: 6, label: 'Tháng 6' },
//     { value: 7, label: 'Tháng 7' },
//     { value: 8, label: 'Tháng 8' },
//     { value: 9, label: 'Tháng 9' },
//     { value: 10, label: 'Tháng 10' },
//     { value: 11, label: 'Tháng 11' },
//     { value: 12, label: 'Tháng 12' }
//   ];

//   years: number[] = [];

//   constructor(private statisticsService: StatisticsService) {
//     const currentYear = new Date().getFullYear();
//     for (let y = currentYear; y >= currentYear - 5; y--) {
//       this.years.push(y);
//     }

//     this.selectedMonth = new Date().getMonth() + 1;
//     this.selectedYear = currentYear;
//   }

//   ngOnInit(): void {
//     Chart.register(LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend, BarController); // Đăng ký các thành phần cần thiết
//     this.loadTopProducts();
//   }

//   ngOnDestroy(): void {
//     // Hủy chartInstance khi component bị hủy để tránh rò rỉ bộ nhớ
//     if (this.chartInstance) {
//       this.chartInstance.destroy();
//     }
//   }

//   loadTopProducts(): void {
//     this.statisticsService
//       .getTopSellingProductsByMonth(this.selectedMonth, this.selectedYear)
//       .subscribe({
//         next: (res) => {
//           this.products = res;
//           this.renderChart(); // Vẽ biểu đồ sau khi tải dữ liệu
//         },
//         error: (err) => {
//           console.error('Lỗi khi tải dữ liệu sản phẩm bán chạy:', err);
//         }
//       });
//   }

//   renderChart(): void {
//     const productNames = this.products.map(p => p.productName);
//     const totalSold = this.products.map(p => p.totalSold);

//     // Đảm bảo phần tử canvas tồn tại và có context hợp lệ
//     const canvas = document.getElementById('revenue-chart-canvas') as HTMLCanvasElement | null;
//     if (!canvas) {
//       console.error('Không tìm thấy phần tử canvas');
//       return;
//     }

//     const ctx = canvas.getContext('2d');
//     if (!ctx) {
//       console.error('Không thể lấy context của canvas');
//       return;
//     }

//     // Hủy chart cũ nếu tồn tại trước khi tạo chart mới
//     if (this.chartInstance) {
//       this.chartInstance.destroy();
//     }

//     // Tạo chart mới và lưu nó vào chartInstance
//     this.chartInstance = new Chart(ctx, {
//       type: 'bar', // Sử dụng 'bar' cho biểu đồ cột
//       data: {
//         labels: productNames,
//         datasets: [{
//           label: 'Số lượng bán',
//           data: totalSold,
//           backgroundColor: 'rgba(54, 162, 235, 0.2)', // Màu cột
//           borderColor: 'rgba(54, 162, 235, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//           y: {
//             beginAtZero: true
//           }
//         }
//       }
//     });
//   }
// }
