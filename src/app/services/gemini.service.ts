import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class GeminiService {
    private readonly BACKEND_URL = `${environment.appBaseUrl}/gemini/ask`;

    constructor(private http: HttpClient) { }

    askGemini(prompt: string): Observable<string> {
        return this.http.post(this.BACKEND_URL, { prompt }, {
            responseType: 'text'  // 👈 Trả về dạng string thuần
        }) as Observable<string>; // 👈 ép kiểu Observable<string> để tránh lỗi
    }
}
