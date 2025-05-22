import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router'; // Bạn bảo bạn đã import Router ở đây.
import { inject } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(private tokenService: TokenService, private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        const isTokenExpired = this.tokenService.isTokenExpired();
        const isUserIdValid = this.tokenService.getUserId() > 0;

        debugger
        // 
        if (!isTokenExpired && isUserIdValid) {
            return true;
        } else {
            // Nếu không authenticated, bạn có thể redirect hoặc trả về một UrlTree khác.
            // Ví dụ: Để về trang login
            this.router.navigate(['/login']);
            return false;
        }
    }
}
export const AuthGuardFn: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(AuthGuard).canActivate(next, state);
}

