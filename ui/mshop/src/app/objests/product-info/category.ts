import { SubCategory } from "./sub-category";

// export interface Category{
//     categoryId?: number;
//     isActive: 1 | 0;
//     categoryName: string;
//     createDate?: any;
//     productSubCategories: SubCategory[];
// }

export class Category{
    categoryId?: number = null;
    isActive: 1 | 0;
    categoryName: string;
    createDate?: any;
    productSubCategories: SubCategory[];
}