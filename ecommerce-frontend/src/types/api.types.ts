import {
  Product,
  User,
  shippingInfo,
  CartItem,
  Order,
  Pie,
  Bar,
  Line,
  Stats,
} from "./types";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};
export type MessageResponse = {
  success: boolean;
  message: string;
};

export type NewProductRequest = {
  id: string;
  formData: FormData;
};

export type AllUsersResponse = {
  success: boolean;
  users: User[];
};

export type UserResponse = {
  success: boolean;
  user: User;
};
export type AllProductResponse = {
  success: boolean;
  products: Product[];
};
export type CategoryResponse = {
  success: boolean;
  categories: string[];
};
export type SearchProductsResponse = AllProductResponse & {
  totalPage: number;
};
export type StatsResponse = {
  success: boolean;
  stats: Stats;
};
export type PieResponse = {
  success: boolean;
  charts: Pie;
};

export type BarResponse = {
  success: boolean;
  charts: Bar;
};

export type LineResponse = {
  success: boolean;
  charts: Line;
};

export type SearchProductsRequest = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};

export type ProductResponse = {
  success: boolean;
  product: Product;
};
export type UpdateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};

export type DeleteProductRequest = {
  userId: string;
  productId: string;
};

export type NewOrderRequest = {
  orderItems: CartItem[];
  shippingInfo: shippingInfo;
  loading: boolean;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
};

export type UpdateOrderRequest = {
  userId: string;
  orderId: string;
};

export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
};
export type OrderDetailsResponse = {
  success: boolean;
  order: Order;
};

export type DeleteUserRequest = {
  userId: string;
  adminUserId: string;
};
