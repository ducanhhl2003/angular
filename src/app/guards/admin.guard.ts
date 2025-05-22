import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router'; // Bạn bảo bạn đã import Router ở đây.
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserResponse } from '../responses/user/user.response';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard {
    userResponse?: UserResponse | null;
    constructor(
        private tokenService: TokenService,
        private router: Router,
        private userService: UserService) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isTokenExpired = this.tokenService.isTokenExpired();
        const isUserIdValid = this.tokenService.getUserId() > 0;
        this.userResponse = this.userService.getUserResponseToLocalStorage();
        const isAdmin = this.userResponse?.roleName == 'ADMIN';
        debugger
        if (!isTokenExpired && isUserIdValid && isAdmin) {
            return true;
        } else {
            // Nếu không authenticated, bạn có thể redirect hoặc trả về một UrlTree khác.
            // Ví dụ: Để về trang login
            this.router.navigate(['/login']);
            return false;
        }
    }
}
export const AdminGuardFn: CanActivateFn =
    (next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean => {
        return inject(AdminGuard).canActivate(next, state);
    }

