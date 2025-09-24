import { ProductDto } from "../types/ProductDto";
export declare function getProducts(): Promise<ProductDto[]>;
export declare function getProduct(id: string): Promise<ProductDto>;
export declare function createProduct(product: ProductDto): Promise<ProductDto>;
export declare function updateProduct(id: string, product: ProductDto): Promise<void>;
export declare function deleteProduct(id: string): Promise<void>;
