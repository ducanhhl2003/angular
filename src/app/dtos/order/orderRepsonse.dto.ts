export class OrderResponse {
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
    orderDetails?: any[]

    constructor(data: any) {
        this.userId = data.userId;
        this.fullName = data.fullName;
        this.email = data.email;
        this.phoneNumber = data.phoneNumber;
        this.address = data.address;
        this.note = data.note;
        this.totalMoney = data.totalMoney;
        this.shippingMethod = data.shippingMethod;
        this.paymentMethod = data.paymentMethod;
        this.couponCode = data.couponCode;
        this.orderDetails = data.orderDetails;
    }
}


// import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';

// export class OrderDTO {

//     user_id: number;
//     fullname: string;
//     email: string;
//     phone_number: string;
//     address: string;
//     note?: string;
//     total_money: number;
//     shipping_method: string;
//     payment_method: string;
//     coupon_code?: string;
//     cart_items: any[];

//     constructor(data: any) {
//         this.user_id = data.user_id;
//         this.fullname = data.fullname;
//         this.email = data.email;
//         this.phone_number = data.phone_number;
//         this.address = data.address;
//         this.note = data.note;
//         this.total_money = data.total_money;
//         this.shipping_method = data.shipping_method;
//         this.payment_method = data.payment_method;
//         this.coupon_code = data.coupon_code;
//         this.cart_items = data.cart_items;
//     }
// }
