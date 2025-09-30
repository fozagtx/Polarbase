export interface Product {
  name: string;
  link: string;
  price: string;
  seller: string;
  isActive: boolean;
}

export interface ProductFormData {
  name: string;
  link: string;
  price: string;
  sellerWallet: string;
}
