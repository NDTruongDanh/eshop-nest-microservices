import { Injectable } from '@nestjs/common';
import { CatalogRepository } from './catalog.repository';
import { Product } from '../entities/product.entity';

@Injectable()
export class InMemoryCatalogRepository implements CatalogRepository {
  private readonly products: Product[] = [];

  async create(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find((product) => product.id === id) || null;
  }
}
