import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare const gapi: any; // Khai báo gapi để tránh lỗi

@Injectable({
    providedIn: 'root'
})
export class GoogleAuthService {
    private gapiLoaded = new BehaviorSubject<boolean>(false);
    gapiLoaded$ = this.gapiLoaded.asObservable();

    constructor() {
        this.loadGoogleApi();
    }

    private loadGoogleApi(): void {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/platform.js';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            gapi.load('auth2', () => {
                gapi.auth2.init({
                    client_id: '508694954488-i7uj9809d0431s85bsd14rs7pno1mg8v.apps.googleusercontent.com', // Thay bằng Client ID thật
                    scope: 'profile email',
                }).then(() => {
                    this.gapiLoaded.next(true);
                });
            });
        };
        document.body.appendChild(script);
    }

    loginWithGoogle(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.gapiLoaded.value) {
                reject('Google API chưa sẵn sàng.');
                return;
            }

            const authInstance = gapi.auth2.getAuthInstance();
            authInstance.signIn().then((googleUser: any) => {
                const token = googleUser.getAuthResponse().id_token;
                resolve(token);
            }).catch((err: any) => { // Thêm kiểu any vào err
                reject(err);
            });
        });
    }
}
