import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductFilter } from '../../models/product-filter.model';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../../../shared/models/category.model';

interface FilterFormValue {
  name: string;
  minPrice: number;
  maxPrice: number;
  categoryId: number;
  available: boolean;
}

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<ProductFilter>();
  
  filterForm: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.setupFilterListener();
  }

  private createForm(): void {
    this.filterForm = this.fb.group({
      name: [''],
      minPrice: [''],
      maxPrice: [''],
      categoryId: [''],
      available: ['']
    });
  }

  private loadCategories(): void {
    this.categoryService.getAllRootCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error: Error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  private setupFilterListener(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((filters: FilterFormValue) => {
        const cleanFilters = Object.entries(filters)
          .reduce<ProductFilter>((acc, [key, value]) => {
            if (value !== null && value !== '') {
              (acc as any)[key] = value;
            }
            return acc;
          }, {});

        this.filterChange.emit(cleanFilters);
      });
  }

  clearFilters(): void {
    this.filterForm.reset();
  }
} 