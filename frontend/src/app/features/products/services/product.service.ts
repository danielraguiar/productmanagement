import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../shared/models/product.model';
import { ProductFilter } from '../models/product-filter.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) { }

  getProducts(page: number = 0, size: number = 10, sort?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  filterProducts(filters: any): Observable<any> {
    const params = new HttpParams({ fromObject: filters });
    return this.http.get<any>(`${this.apiUrl}/filter`, { params });
  }

  findByFilters(
    filters: ProductFilter,
    page: number = 0,
    size: number = 10,
    sort?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    if (filters.name) {
      params = params.set('name', filters.name);
    }
    if (filters.minPrice) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters.categoryId) {
      params = params.set('categoryId', filters.categoryId.toString());
    }
    if (filters.available !== undefined) {
      params = params.set('available', filters.available.toString());
    }

    return this.http.get<any>(`${this.apiUrl}/filter`, { params });
  }
} 