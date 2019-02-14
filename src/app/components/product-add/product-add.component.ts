import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductApiService} from '../../services/product-api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { CategoryApiService } from 'src/app/services/category-api.service';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {

  productForm: FormGroup;
  productName:string='';
  description:string='';
  quantity:number=null;
  price:number=null;
  category: Category = null;
  size: string[] = [];
  isLoadingResults = false;

  categories: Category[] = [];
  productSizes: string[] = ['S','M', 'L'];

  constructor(private router: Router, private productApiService: ProductApiService,
    private categoryApiService: CategoryApiService,  private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      'productId': [null,Validators.required],
      'productName' : [null, Validators.required],
      'description' : [null, Validators.required],
      'quantity' : [null, Validators.required],
      'price' : [null, Validators.required],
      'category' : [this.categories, Validators.required],
      'size' : [null, Validators.required]
    });
    this.getCategories();
  }

  onFormSubmit(form:NgForm) {
    this.isLoadingResults = true;
    this.productApiService.addProduct(form)
      .subscribe(res => {
          console.log(res);
          let id = res['productId'];
          this.isLoadingResults = false;
          this.router.navigate(['/product-details', id]);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        });
  }

  getCategories() {
    this.categoryApiService.getCategories()
      .subscribe(res => {
        this.categories = res;
        console.log(this.categories);
        this.isLoadingResults = false;
      }, err => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

}
