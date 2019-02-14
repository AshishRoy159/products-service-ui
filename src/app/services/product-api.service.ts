import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Product } from '../models/product';
import { NgForm } from '@angular/forms';
import { Category } from '../models/category';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = "http://localhost:8080/api/products";

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  constructor(private http: HttpClient) { }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      console.error(error);
  
      return of(result as T);
    };
  }

  getProducts (): Observable<Product[]> {
    return this.http.get<Product[]>(apiUrl)
      .pipe(
        tap(_ => console.log('fetched products')),
        catchError(this.handleError('getProducts', []))
      );
  }
  
  getProduct(id: string): Observable<Product> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      tap(_ => console.log(`fetched product id=${id}`)),
      catchError(this.handleError<Product>(`getProduct id=${id}`))
    );
  }
  
  addProduct (product: NgForm): Observable<Product> {
    return this.http.post<Product>(apiUrl, product, httpOptions).pipe(
      tap((product: Product) => console.log(`added product w/ id=${product.productId}`)),
      catchError(this.handleError<Product>('addProduct'))
    );
  }
  
  updateProduct (productId : string, product): Observable<any> {
    const url = `${apiUrl}/${productId}`;
    return this.http.put(url, product, httpOptions).pipe(
      tap(_ => console.log(`updated product id=${productId}`)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }
  
  deleteProduct (productId: string): Observable<Product> {
    const url = `${apiUrl}/${productId}`;
  
    return this.http.delete<Product>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted product id=${productId}`)),
      catchError(this.handleError<Product>('deleteProduct'))
    );
  }

  getProductCategory(productId: string): Observable<Category> {
    const url = `${apiUrl}/${productId}/categories`;
    return this.http.get<Category>(url, httpOptions).pipe(
      tap(_ => console.log(`fetched category for product w/ id=${productId}`)),
      catchError(this.handleError<any>('getProductCategory'))
    )
  }
}
