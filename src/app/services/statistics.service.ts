import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TopSellingProduct } from '../models/top-selling-product';

@Injectable({
    providedIn: 'root'
})
export class StatisticsService {
    private baseUrl = '/api/v1/library/product';

    constructor(private http: HttpClient) { }

    getTopSellingProductsByMonth(month: number, year: number, limit: number = 5): Observable<TopSellingProduct[]> {
        const params = new HttpParams()
            .set('month', month)
            .set('year', year)
            .set('limit', limit);

        return this.http.get<TopSellingProduct[]>(`${this.baseUrl}/top-selling`, { params });
    }
}

// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { TopSellingProduct } from '../models/top-selling-product';
// import { map } from 'rxjs/operators';

// @Injectable({
//     providedIn: 'root'
// })
// export class StatisticsService {
//     private baseUrl = '/api/v1/library/product'; // Đảm bảo đúng đường dẫn API

//     constructor(private http: HttpClient) { }

//     getTopSellingProducts(): Observable<TopSellingProduct[]> {
//         return this.http.get<any>(`${this.baseUrl}/top-selling`) // Đảm bảo đường dẫn chính xác
//             .pipe(
//                 map(res => {
//                     console.log('API Response:', res); // Log response để kiểm tra
//                     return res; // Kiểm tra xem res có đúng dữ liệu không
//                 })
//             );
//     }
// }
