import { IsUUID } from 'class-validator';

export class GetProductByIdParams {
  @IsUUID()
  id: string;
}
