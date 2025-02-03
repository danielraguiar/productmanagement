import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ProductFilterComponent } from './product-filter.component';
import { CategoryService } from '../../services/category.service';

describe('ProductFilterComponent', () => {
  let component: ProductFilterComponent;
  let fixture: ComponentFixture<ProductFilterComponent>;
  let categoryService: jasmine.SpyObj<CategoryService>;

  const mockCategories = [
    { 
      id: 1, 
      name: 'Category 1', 
      path: 'Category 1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 2, 
      name: 'Category 2', 
      path: 'Category 2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  beforeEach(async () => {
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getAllRootCategories']);
    categoryServiceSpy.getAllRootCategories.and.returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      declarations: [ProductFilterComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy }
      ]
    }).compileComponents();

    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should load categories on init', () => {
    expect(categoryService.getAllRootCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories);
  });

  it('should emit filter changes', (done) => {
    const testFilters = {
      name: 'Test',
      minPrice: 10,
      maxPrice: 100,
      categoryId: 1,
      available: true
    };

    component.filterChange.subscribe(filters => {
      expect(filters).toEqual(testFilters);
      done();
    });

    component.filterForm.patchValue(testFilters);
  });

  it('should clear filters', () => {
    component.filterForm.patchValue({
      name: 'Test',
      minPrice: 10,
      maxPrice: 100
    });

    component.clearFilters();

    expect(component.filterForm.value).toEqual({
      name: null,
      minPrice: null,
      maxPrice: null,
      categoryId: null,
      available: null
    });
  });
}); 