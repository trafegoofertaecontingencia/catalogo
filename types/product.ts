export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: {
    name: string;
  };
  barcode: string;
};