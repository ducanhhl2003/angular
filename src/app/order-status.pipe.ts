import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'PENDING':
        return 'Đơn hàng đang chờ xử lý';
      case 'PAID':
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'SHIPPED':
        return 'Đang giao hàng';
      case 'DELIVERED':
        return 'Đã giao hàng';
      case 'CANCELED':
        return 'Đã hủy';
      default:
        return 'Trạng thái không xác định';
    }
  }

}
