import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private apiGetCategories = `${environment.appBaseUrl}/category`;


    constructor(private http: HttpClient) { }

    getCategories(page: number, limit: number): Observable<Category[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());
        return this.http.get<Category[]>(this.apiGetCategories, { params });
    }
}
