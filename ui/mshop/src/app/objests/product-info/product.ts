import { Category } from "./category";
import { ProductSellBy } from "./product-sell-by";

export class Product{
    productId?: number;
    isActive: 1 | 0;
    productName: string;
    productDescription: string;
    createDate?: any;
    productSellBy: ProductSellBy;
    productCategories: Category[]
}
