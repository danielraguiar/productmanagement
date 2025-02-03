export interface Category {
    id: number;
    name: string;
    parentId?: number;
    path: string;
    children?: Category[];
    createdAt: string;
    updatedAt: string | null;
} 