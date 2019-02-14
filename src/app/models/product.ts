import { Category } from './category';

export class Product {

    productId: string;
    productName: string;
    description: string;
    quantity: number;
    price: number;
    category: Category;
    size: string[];
    
}