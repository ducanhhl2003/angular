import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';

export class OrderDTO {
    id: number;
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    note?: string;
    totalMoney: number;
    shippingMethod: string;
    paymentMethod: string;
    couponCode?: string;
    cartItems: any[];

    constructor(data: any) {
        this.id = data.id;
        this.userId = data.user_id;
        this.fullName = data.fullname;
        this.email = data.email;
        this.phoneNumber = data.phone_number;
        this.address = data.address;
        this.note = data.note;
        this.totalMoney = data.total_money;
        this.shippingMethod = data.shipping_method;
        this.paymentMethod = data.payment_method;
        this.couponCode = data.coupon_code;
        this.cartItems = data.cart_items;
    }
}
