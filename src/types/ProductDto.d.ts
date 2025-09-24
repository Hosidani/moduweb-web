export interface ProductDto {
    id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    sku: number;
    images?: string[];
}
