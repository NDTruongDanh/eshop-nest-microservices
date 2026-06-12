import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export type ProductDto = {
  id: string;
  name: string;
  category: string[];
  description: string;
  imageFile: string;
  price: number;
};

export class CreateProductRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  category: string[];

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  imageFile: string;

  @IsNumber()
  @IsPositive()
  price: number;
}

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
