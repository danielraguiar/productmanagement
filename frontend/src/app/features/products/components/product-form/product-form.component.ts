import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../../../shared/models/product.model';
import { Category } from '../../../../shared/models/category.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loadCategories();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.productId = id;
      this.loadProduct(id);
    }
  }

  private createForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      available: [true]
    });
  }

  private loadCategories() {
    this.categoryService.getAllCategories().subscribe(
      categories => {
        this.categories = categories;
      },
      error => {
        console.error('Error loading categories:', error);
      }
    );
  }

  private loadProduct(id: number) {
    this.loading = true;
    this.productService.getProduct(id).subscribe(
      product => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          available: product.available
        });
        this.loading = false;
      },
      error => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    );
  }

  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;
    const product = this.productForm.value;

    const request = this.isEditMode
      ? this.productService.updateProduct(this.productId!, product)
      : this.productService.createProduct(product);

    request.subscribe(
      () => {
        this.router.navigate(['/products']);
      },
      error => {
        console.error('Error saving product:', error);
        this.loading = false;
      }
    );
  }

  onCancel() {
    this.router.navigate(['/products']);
  }
} 