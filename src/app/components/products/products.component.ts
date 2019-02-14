import { Component, OnInit } from '@angular/core';

import { ProductApiService } from '../../services/product-api.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  displayedColumns: string[] = ['productId', 'name', 'description', 'quantity', 'price'];
  data: Product[] = [];
  isLoadingResults = true;

  constructor(private apiService :ProductApiService) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.apiService.getProducts()
    .subscribe(res => {
      this.data = res;
      console.log(this.data);
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }
  
}
