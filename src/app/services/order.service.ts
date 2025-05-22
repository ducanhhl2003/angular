import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { OrderDTO } from '../dtos/order/order.dto';
import { environment } from '../environments/environment';
import { OrderResponse } from '../dtos/order/orderRepsonse.dto';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly apiUrl = `${environment.appBaseUrl}/order`;

    constructor(private http: HttpClient) { }

    placeOrder(order: OrderDTO): Observable<any> {
        return this.http.post<any>(this.apiUrl, order).pipe(
            catchError((error) => {
                console.error('Order placement failed', error);
                return throwError(() => new Error('Failed to place order. Please try again later.'));
            })
        );
    }
    getOrderById(orderId: number) {
        return this.http.get(`${environment.appBaseUrl}/order/${orderId}`);
    }
    createStripeSession(order: OrderDTO): Observable<{ checkoutUrl: string }> {
        return this.http.post<{ checkoutUrl: string }>(
            `${environment.appBaseUrl}/stripe/create-checkout-session`,
            order
        ).pipe(
            catchError((error) => {
                console.error('Failed to create Stripe session', error);
                return throwError(() => new Error('Failed to initiate Stripe payment. Please try again.'));
            })
        );
    }
    updateOrderStatus(orderId: number, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/update-order-status/${orderId}?status=${status}`, {});
    }
    getOrders(page: number, limit: number, keyword?: string): Observable<any> {
        const params: any = { page, limit };
        if (keyword) params.keyword = keyword;

        return this.http.get(`${environment.appBaseUrl}/order/get-orders-by-keyword`, { params });
    }
    getOrdersByUserId(userId: number): Observable<any> {
        return this.http.get(`${environment.appBaseUrl}/order/user/${userId}`);
    }

}
