export interface ProductDto {
  id?: string; // uuid from backend
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: number;
  images?: string[];
  categories: string[];
}
