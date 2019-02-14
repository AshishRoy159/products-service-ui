import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductApiService } from '../../services/product-api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { CategoryApiService } from 'src/app/services/category-api.service';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  productForm: FormGroup;
  productId: string = '';
  productName:string='';
  description:string='';
  quantity:number=null;
  price:number=null;
  category: Category = null;
  size: string[] = [];
  isLoadingResults = false;

  categories: Category[] = [];
  productSizes: string[] = ['S','M', 'L'];
  selectedCategory: Category = null;

  constructor(private router: Router, private route: ActivatedRoute, private productApiService: ProductApiService,
     private categoryApiService: CategoryApiService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getProduct(this.route.snapshot.params['id']);
    this.getCategories();
    this.getProductCategory(this.route.snapshot.params['id']);
    console.log(this.selectedCategory);
    this.productForm = this.formBuilder.group({
      'productId': [null,Validators.required],
      'productName' : [null, Validators.required],
      'description' : [null, Validators.required],
      'quantity' : [null, Validators.required],
      'price' : [null, Validators.required],
      'category' : [null, Validators.required],
      'size' : [null, Validators.required]
    });
    
  }

  getProduct(id: string) {
    this.productApiService.getProduct(id).subscribe(data => {
      this.productId = data.productId;
      this.productForm.setValue({
        productId: data.productId,
        productName: data.productName,
        description: data.description,
        quantity: data.quantity,
        price: data.price,
        category: this.selectedCategory,
        size: data.size
      });
      console.log(this.selectedCategory);
      console.log(this.productForm.get('category'));
      this.productForm.get('category').setValue(this.selectedCategory);
      console.log(this.productForm.get('category'));
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

  getProductCategory(productId: string) {
    this.productApiService.getProductCategory(productId)
      .subscribe(res => {
        this.selectedCategory = res;
        console.log(this.selectedCategory);
        this.isLoadingResults = false;
      }, err => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

  onFormSubmit(form:NgForm) {
    this.isLoadingResults = true;
    this.productApiService.updateProduct(this.productId, form)
      .subscribe(res => {
          let id = res['productId'];
          this.isLoadingResults = false;
          this.router.navigate(['/product-details', id]);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  productDetails() {
    this.router.navigate(['/product-details', this.productId]);
  }

}
