import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '@core/services/notification.service';
import { Category } from '@shared/models/category.model';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;
  parentId: number | null = null;
  loading = false;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loadCategories();
    
    // Get parentId from query params (for subcategories)
    this.parentId = Number(this.route.snapshot.queryParams['parentId']) || null;
    
    // Get categoryId from route params (for edit mode)
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.categoryId = Number(id);
      this.loadCategory(this.categoryId);
    }

    if (this.parentId) {
      this.categoryForm.patchValue({ parentId: this.parentId });
    }
  }

  private createForm() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      parentId: [null]
    });
  }

  private loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.notificationService.error('Error loading categories');
      }
    });
  }

  private loadCategory(id: number) {
    this.loading = true;
    this.categoryService.getCategory(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name: category.name,
          parentId: category.parentId
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.notificationService.error('Error loading category');
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      return;
    }

    this.loading = true;
    const category = this.categoryForm.value;

    const request = this.isEditMode
      ? this.categoryService.updateCategory(this.categoryId!, category)
      : this.categoryService.createCategory(category);

    request.subscribe({
      next: () => {
        this.notificationService.success(
          `Category ${this.isEditMode ? 'updated' : 'created'} successfully`
        );
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        console.error('Error saving category:', error);
        this.notificationService.error('Error saving category');
        this.loading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/categories']);
  }
} 