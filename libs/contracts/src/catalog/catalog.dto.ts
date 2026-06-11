export type ProductDto = {
  id: string;
  name: string;
  category: string[];
  description: string;
  imageFile: string;
  price: number;
};

export type CreateProductRequest = {
  name: string;
  category: string[];
  description: string;
  imageFile: string;
  price: number;
};

export type CreateProductResponse = {
  product: ProductDto;
};

export type GetProductsRequest = Record<string, never>;

export type GetProductsResponse = {
  products: ProductDto[];
};

export type GetProductByIdRequest = {
  id: string;
};

export type GetProductByIdResponse = {
  product: ProductDto;
};
