// import { Injectable } from '@angular/core';
// import { JwtHelperService } from '@auth0/angular-jwt';
// @Injectable({
//     providedIn: 'root'
// })
// export class TokenService {
//     private readonly TOKEN_KEY = 'access_token';
//     private jwtHelperService = new JwtHelperService();
//     constructor() { }
//     getToken(): string | null {
//         return localStorage.getItem(this.TOKEN_KEY);
//     }
//     setToken(token: string): void {
//         localStorage.setItem(this.TOKEN_KEY, token);
//     }
//     getUserId(): number {
//         let userObject = this.jwtHelperService.decodeToken(this.getToken() ?? '');
//         return 'id' in userObject ? parseInt(userObject['id']) : 0;
//     }
//     removeToken(): void {
//         localStorage.removeItem(this.TOKEN_KEY);
//     }
//     isTokenExpired(): boolean {
//         const token = this.getToken();
//         return !token || this.jwtHelperService.isTokenExpired(token);
//     }

// }
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly TOKEN_KEY = 'access_token';
    private jwtHelperService = new JwtHelperService();

    constructor() { }

    /** Lấy token từ localStorage */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /** Lưu token vào localStorage */
    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    /** Xóa token khỏi localStorage */
    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    /** Kiểm tra token có hết hạn không */
    isTokenExpired(): boolean {
        const token = this.getToken();
        return !token || this.jwtHelperService.isTokenExpired(token);
    }

    /** Lấy userId từ token hoặc localStorage */
    getUserId(): number {
        const token = this.getToken();

        // 🔥 Kiểm tra xem token có tồn tại không
        if (!token) {
            console.warn('❌ Không tìm thấy token trong localStorage');
            return this.getUserIdFromLocalStorage(); // Nếu không có token, lấy từ localStorage
        }

        try {
            const decodedToken = this.jwtHelperService.decodeToken(token);
            console.log('✅ Token đã giải mã:', decodedToken);

            // 🔥 Lấy userId từ token, kiểm tra cả 'id' và 'userId'
            return decodedToken?.id ?? decodedToken?.userId ?? this.getUserIdFromLocalStorage();
        } catch (error) {
            console.error('❌ Lỗi giải mã token:', error);
            return this.getUserIdFromLocalStorage();
        }
    }

    /** Lấy userId từ localStorage nếu token không có */
    private getUserIdFromLocalStorage(): number {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            console.warn('❌ Không tìm thấy user trong localStorage');
            return 0;
        }

        try {
            const userObject = JSON.parse(userJson);
            console.log('✅ Dữ liệu user:', userObject);
            return userObject?.id ?? 0;
        } catch (error) {
            console.error('❌ Lỗi parse user:', error);
            return 0;
        }
    }
}
