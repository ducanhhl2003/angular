import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { HomeComponent } from './components/home/home.component';
import { DetailComponent } from './components/detail/detail.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderConfirmComponent } from './components/order-confirm/order-confirm.component';
import { AdminComponent } from './components/admins/admin/admin.component';
import { AdminGuardFn } from './guards/admin.guard';
import { SuccessComponent } from './components/success/success.component';
import { AuthGuardFn } from './guards/auth.guard';
import { ProductAdminComponent } from './components/admins/product/product-admin/product-admin.component';
import { ProductEditComponent } from './components/admins/product/productedit/productedit.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AppComponent } from './components/app/app.component';
import { OrderadminComponent } from './components/admins/order/orderadmin/orderadmin.component';
import { UserAdminComponent } from './components/admins/user/useradmin/useradmin.component';
import { ProductCreateComponent } from './components/admins/product/productcreate/productcreate.component';
import { TopSellingProductsComponent } from './components/admins/top-selling-products/top-selling-products.component';
import { ShopComponent } from './components/shop/shop.component';
import { FollowComponent } from './components/follow/follow.component';
export const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'shop', component: ShopComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'products/:id', component: DetailComponent },
            { path: 'orders', component: OrderComponent, canActivate: [AuthGuardFn] },
            { path: 'cart', component: OrderConfirmComponent },
            { path: 'success', component: SuccessComponent },
            { path: 'orders/:id', component: OrderDetailComponent },
            { path: 'follow', component: FollowComponent },

        ]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AdminGuardFn],
        children: [
            { path: 'products', component: ProductAdminComponent },
            { path: 'products/create', component: ProductCreateComponent }, // Đây là Standalone Component
            { path: 'products/edit/:id', component: ProductEditComponent }, // Đây cũng là Standalone Component
            { path: 'order', component: OrderadminComponent }, // Đây là Standalone Component
            { path: 'user', component: UserAdminComponent },
            { path: 'top', component: TopSellingProductsComponent }, // Đây là Standalone Component


        ]
    }
];
