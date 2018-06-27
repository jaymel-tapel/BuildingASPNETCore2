﻿import { Component } from "@angular/core";
import { DataService } from "../shared/dataService";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { Product } from "../shared/product";

@Component({
    selector: "product-list",
    templateUrl: "productList.component.html",
    styleUrls: [ "productList.component.css" ]
})
export class ProductList implements OnInit{

    constructor(private data: DataService) {
        this.products = data.products;
    }

    public products: Product[];

    ngOnInit(): void {
        this.data.loadProducts()
            .subscribe(success => {
                if (success) {
                    this.products = this.data.products;
                }
            });
    }

    AddProduct(product: Product) {
        this.data.AddToOrder(product);
    }
}