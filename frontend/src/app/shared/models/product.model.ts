import { Category } from './category.model';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    categoryPath: string;
    categoryName: string;
    available: boolean;
    createdAt: string;
    updatedAt: string | null;
} 