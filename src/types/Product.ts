export interface Product {
  id: string;
  name: string;
  price: number;
  priceVat: number;
  margin: number;
  stock: number;
  categoryId: string;
  popularityScore?: number; // skóre pro řazení / AI
  sold?: number; // kolik kusů bylo prodáno, až přijde API
  lastUpdated?: string; // timestamp z feedu nebo API
}
