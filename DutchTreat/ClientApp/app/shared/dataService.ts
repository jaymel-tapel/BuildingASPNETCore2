import { HttpClient, HttpHeaders  } from "@angular/common/http";
import { Injectable } from "@angular/core";
import 'rxjs/add/operator/map';
import { Product } from "./product";
import { Observable } from "rxjs/Observable";
import { Order, OrderItem } from "./order";

@Injectable()
export class DataService {

    constructor(private http: HttpClient) { }

    private token: string = "";
    private tokenExpiration: Date;

    public order: Order = new Order();

    public products: Product[] = [];

    loadProducts(): Observable<Product[]> {
        return this.http.get("/api/products")
            .map((res: Response) => this.products = JSON.parse(JSON.stringify(res)));
    }

    public login(creds) {
        return this.http.post("/account/createtoken", creds)
            .map(res => {
                let tokenInfo = JSON.parse(JSON.stringify(res));
                this.token = tokenInfo.token;
                this.tokenExpiration = tokenInfo.expiration;
                return true;
            });
    }

    public checkout() {
        if (!this.order.orderNumber) {
            this.order.orderNumber = this.order.orderDate.getFullYear().toString() + this.order.orderDate.getTime().toString();
        }
        return this.http.post("/api/orders", this.order, {
            headers: new HttpHeaders({ "Authorization": "Bearer " + this.token })
           })
            .map(res => {
                this.order = new Order();
                return true;
            })
    }

    public get loginRequired(): boolean {
        return this.token.length == 0 || this.tokenExpiration > new Date();
    }

    public AddToOrder(product: Product) {

        let item: OrderItem = this.order.items.find(i => i.product.id == product.id);

        if (item) {
            item.quantity++;
        } else {
            item = new OrderItem();
            item.product = product;
            item.unitPrice = product.price;
            item.quantity = 1;
            this.order.items.push(item);
        }
    }
}