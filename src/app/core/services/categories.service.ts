import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.url_api}/categories/`);
  }

  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`${environment.url_api}/categories/${id}`);
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${environment.url_api}/categories/`, data);
  }

  updateCategory(id: string, data: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(
      `${environment.url_api}/categories/${id}`,
      data
    );
  }

  checkCategory(name: string) {
    return this.http.post<{isAvailable: boolean}>(`${environment.url_api}/categories/availability`, {
      name,
    });
  }
}
