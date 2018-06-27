import * as _ from "lodash";
import { Product } from "./product";

export class Order {
    orderId: number;
    orderDate: Date = new Date();
    orderNumber: string;
    items: Array<OrderItem> = new Array<OrderItem>();

    get subtotal(): number {
        return _.sum(_.map(this.items, i => i.unitPrice * i.quantity));
    };
}

export class OrderItem {
    id: number;
    quantity: number;
    unitPrice: number;
    product: Product;
}