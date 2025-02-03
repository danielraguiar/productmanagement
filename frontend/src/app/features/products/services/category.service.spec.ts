import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { environment } from '@env/environment';
import { Category } from '@shared/models';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  const mockCategory: Category = {
    id: 1,
    name: 'Test Category',
    path: 'Test Category',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should get all root categories', () => {
    const mockCategories = [mockCategory];

    service.getAllCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should get a category by id', () => {
    service.getCategory(1).subscribe(category => {
      expect(category).toEqual(mockCategory);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/categories/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategory);
  });

  it('should create a category', () => {
    const newCategory = {
      name: 'New Category',
      path: 'New Category',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    service.create(newCategory).subscribe(category => {
      expect(category).toEqual({ ...mockCategory, ...newCategory });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/categories`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...mockCategory, ...newCategory });
  });

  it('should update a category', () => {
    const updateData = {
      name: 'Updated Category',
      path: 'Updated Category'
    };

    service.update(1, updateData).subscribe(category => {
      expect(category).toEqual({ ...mockCategory, ...updateData });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/categories/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ ...mockCategory, ...updateData });
  });

  it('should delete a category', () => {
    service.deleteCategory(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/categories/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
}); 