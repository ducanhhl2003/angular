import { bootstrapApplication } from "@angular/platform-browser";
import { HomeComponent } from "./app/components/home/home.component";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './app/interceptors/token.interceptor';
import { DetailComponent } from "./app/components/detail/detail.component";
import { OrderConfirmComponent } from "./app/components/order-confirm/order-confirm.component";
import { OrderComponent } from "./app/components/order/order.component";
import { OrderDetailComponent } from "./app/components/order-detail/order-detail.component";
import { AppComponent } from "./app/components/app/app.component";
import { provideRouter, Routes } from '@angular/router';
import { routes } from "./app/app.routes";
import { AppLayoutComponent } from "./app/components/app-layout/app-layout.component";


// bootstrapApplication(HomeComponent, {
//   providers: [
//     provideHttpClient(withInterceptorsFromDi()), // Dùng Interceptors từ DI
//     { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }, // Đăng ký Interceptor vào DI
//   ]
// }).catch(err => console.error(err));
// bootstrapApplication(DetailComponent, {
//   providers: [provideHttpClient()]
// }).catch(err => console.error(err));
// bootstrapApplication(OrderConfirmComponent, {
//   providers: [provideHttpClient()]
// }).catch(err => console.error(err));
// bootstrapApplication(OrderComponent, {
//   providers: [provideHttpClient()]
// }).catch(err => console.error(err));

// bootstrapApplication(OrderDetailComponent, {
//   providers: [provideHttpClient()]
// }).catch(err => console.error(err));

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideHttpClient(withInterceptorsFromDi()),
//     { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
//     provideRouter(routes) // Chỉ giữ lại một lần
//   ]
// }).catch(err => console.error(err));
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    provideRouter(routes) // Chỉ giữ lại một lần
  ]
}).catch(err => console.error(err));