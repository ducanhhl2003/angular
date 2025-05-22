import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../environments/environment';
import { ProductDTO } from '../dtos/product/product.dto';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private apiGetProducts = `${environment.appBaseUrl}/product`;
    private apiCreateProduct = `${environment.appBaseUrl}/product`;
    private apiUpload = `${environment.appBaseUrl}/product`;


    constructor(private http: HttpClient) { }
    private apiConfig = {
        headers: this.createHeaders(),
    }
    private createHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept-Language': 'vi'
        });
    }
    getProducts(keyword: string, categoryId: number, minPrice: number, maxPrice: number, page: number, limit: number,): Observable<Product[]> {
        const params = new HttpParams()
            .set('keyword', keyword)
            .set('categoryId', categoryId.toString())
            .set('page', page.toString())
            .set('limit', limit.toString())
            .set('minPrice', minPrice)
            .set('maxPrice', maxPrice);

        return this.http.get<Product[]>(this.apiGetProducts, { params });
    }
    getProductAdmin(keyword: string, categoryId: number, page: number, limit: number,): Observable<Product[]> {
        const params = new HttpParams()
            .set('keyword', keyword)
            .set('categoryId', categoryId.toString())
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.http.get<Product[]>(this.apiGetProducts, { params });
    }


    // getProducts(keyword: string, categoryId: number, page: number, limit: number, minPrice: number, maxPrice: number): Observable<Product[]> {
    //     const params = new HttpParams()
    //         .set('keyword', keyword)
    //         .set('categoryId', categoryId)
    //         .set('page', page.toString())
    //         .set('limit', limit.toString())
    //         .set('minPrice', minPrice.toString())
    //         .set('maxPrice', maxPrice.toString());
    //     return this.http.get<Product[]>(this.apiGetProducts, { params });
    // }
    getDetailProduct(productId: number) {
        return this.http.get(`${environment.appBaseUrl}/product/${productId}`);
    }
    getHotProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiGetProducts}/hot`);
    }
    getProductsByIds(productIds: number[]): Observable<Product[]> {
        debugger
        const params = new HttpParams().set('ids', productIds.join(','));
        return this.http.get<Product[]>(`${this.apiGetProducts}/by-ids`, { params })
    }
    createProduct(productDTO: ProductDTO): Observable<any> {
        return this.http.post(this.apiCreateProduct, productDTO, this.apiConfig)
    }
    uploadImage(productId: number, formData: FormData) {
        return this.http.post<{ thumbnail: string }>(
            `${this.apiCreateProduct}/uploads/${productId}`,
            formData
        );
    }
    getImagesByProductId(productId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUpload}/${productId}/images`);
    }

    updateProductThumbnail(productId: number, thumbnail: string) {
        return this.http.put(`${environment.appBaseUrl}/product/${productId}/thumbnail`, { thumbnail });
    }
    deleteProducts(ids: number[]): Observable<void> {
        return this.http.delete<void>(`${environment.appBaseUrl}/product`, { body: ids });
    }



}
