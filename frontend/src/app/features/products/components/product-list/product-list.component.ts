import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Product } from '@shared/models';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '@core/services/notification.service';
import { ProductFilter } from '../../models/product-filter.model';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'price', 'category', 'available', 'actions'];
  dataSource: MatTableDataSource<Product>;
  totalItems = 0;
  loading = false;
  currentFilter: ProductFilter = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.dataSource = new MatTableDataSource<Product>();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    const pageIndex = this.paginator?.pageIndex || 0;
    const pageSize = this.paginator?.pageSize || 10;
    const sortField = this.sort?.active;
    const sortDirection = this.sort?.direction;

    this.productService.findByFilters(
      this.currentFilter,
      pageIndex,
      pageSize,
      sortField ? `${sortField},${sortDirection}` : undefined
    ).pipe(
      finalize(() => this.loading = false),
      catchError(error => {
        this.notificationService.error('Error loading products. Please try again.');
        console.error('Error:', error);
        return of({ content: [], totalElements: 0 });
      })
    ).subscribe(response => {
      this.dataSource.data = response.content;
      this.totalItems = response.totalElements;
    });
  }

  onAdd(): void {
    this.router.navigate(['/products/new']);
  }

  onEdit(product: Product): void {
    this.router.navigate([`/products/edit/${product.id}`]);
  }

  onDelete(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Product',
        message: `Are you sure you want to delete ${product.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.productService.deleteProduct(product.id).pipe(
          finalize(() => this.loading = false),
          catchError(error => {
            this.notificationService.error('Error deleting product. Please try again.');
            console.error('Error:', error);
            return of(null);
          })
        ).subscribe(() => {
          this.notificationService.success('Product deleted successfully');
          this.loadProducts();
        });
      }
    });
  }

  onFilterChange(filters: ProductFilter): void {
    this.currentFilter = filters;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadProducts();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
} 