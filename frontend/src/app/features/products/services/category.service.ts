import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../../shared/models/category.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/api/categories`;

  constructor(private http: HttpClient) { }

  getAllRootCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/root`);
  }

  getSubcategories(parentId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/${parentId}/subcategories`);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/all`);
  }
} 