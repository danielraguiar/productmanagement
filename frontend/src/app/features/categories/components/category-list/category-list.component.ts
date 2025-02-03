import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { CategoryService } from '../../services';
import { Category } from '@shared/models/category.model';
import { NotificationService } from '@core/services/notification.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  treeControl = new NestedTreeControl<Category>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Category>();
  loading = false;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  hasChild = (_: number, node: Category) => !!node.children && node.children.length > 0;

  loadCategories() {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.dataSource.data = this.buildCategoryTree(categories);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.notificationService.error('Error loading categories');
        this.loading = false;
      }
    });
  }

  private buildCategoryTree(categories: Category[]): Category[] {
    const categoryMap = new Map<number, Category>();
    const roots: Category[] = [];

    // First pass: create map of id to category
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build tree structure
    categories.forEach(category => {
      const currentCategory = categoryMap.get(category.id);
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(currentCategory!);
        }
      } else {
        roots.push(currentCategory!);
      }
    });

    return roots;
  }

  onAddCategory() {
    this.router.navigate(['/categories/new']);
  }

  onAddSubcategory(parentId: number) {
    this.router.navigate(['/categories/new'], { 
      queryParams: { parentId } 
    });
  }

  onEditCategory(id: number) {
    this.router.navigate([`/categories/edit/${id}`]);
  }

  onDeleteCategory(category: Category) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Category',
        message: `Are you sure you want to delete ${category.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.deleteCategory(category.id).subscribe({
          next: () => {
            this.notificationService.success('Category deleted successfully');
            this.loadCategories();
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            this.notificationService.error('Error deleting category');
          }
        });
      }
    });
  }
} 