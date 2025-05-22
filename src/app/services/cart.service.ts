import { Injectable } from "@angular/core";
import { Product } from "../models/product";
import { ProductService } from "./product.service";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class CartService {
    private cart: Map<number, number> = new Map();

    constructor(private productService: ProductService) {
        // const storedCart = localStorage.getItem('cart');
        // if (storedCart) {
        //     this.cart = new Map(JSON.parse(storedCart));
        // }
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            this.cart = new Map<number, number>(
                JSON.parse(storedCart).map(([key, value]: [string, number]) => [Number(key), value])
            );
        }

    }
    addToCart(productId: number, quantity: number = 1): void {
        debugger
        if (this.cart.has(productId)) {
            this.cart.set(productId, this.cart.get(productId)! + quantity);
        } else {
            this.cart.set(productId, quantity);
        }
        this.saveCartToLocalStorage();
        console.log("Cart:", this.getCart());
    }
    getCart(): Map<number, number> {
        return this.cart;
    }

    private saveCartToLocalStorage(): void {
        localStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
    }
    clearCart(): void {
        this.cart.clear();
        this.saveCartToLocalStorage();
    }
    removeItem(id: number): void {
        const key = Number(id); // Đảm bảo ID là kiểu số
        console.log("Removing ID:", key);
        console.log("Current cart:", Array.from(this.cart.entries()));

        if (this.cart.has(key)) {
            this.cart.delete(key);
            this.saveCartToLocalStorage();
            this.updateCart(this.cart);
            console.log("Cart after removal:", Array.from(this.cart.entries()));
        } else {
            console.warn("ID not found in cart:", key);
        }
    }
    updateCart(cart: Map<number, number>): void {
        localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));  // Cập nhật giỏ hàng vào localStorage
    }


}
