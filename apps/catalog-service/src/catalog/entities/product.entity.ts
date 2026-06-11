export type productProps = {
  id: string;
  name: string;
  category: string[];
  description: string;
  imageFile: string;
  price: number;
};

export class Product {
  private constructor(private readonly props: productProps) {}

  // Factory method to create a new Product instance
  static create(props: Omit<productProps, 'id'>): Product {
    return new Product({
      id: crypto.randomUUID(),
      ...props,
    });
  }

  get id(): string {
    return this.props.id;
  }

  toJson(): productProps {
    return this.props;
  }
}
