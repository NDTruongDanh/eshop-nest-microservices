import { Product } from '../entities/product.entity';

export abstract class CatalogRepository {
  abstract create(product: Product): Promise<Product>;
  abstract findAll(): Promise<Product[]>;
  abstract findById(id: string): Promise<Product | null>;
}
