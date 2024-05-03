import { Request, Response, NextFunction } from "express";
export interface NewuserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}
export interface NewproductRequestBody {
  name: string;
  category: string;
  price: number;
  stock: number;
}
export type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};
export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: Number;
};
export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  user: string;
  subtotal: number;
  tax: number;
  ShippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemType[];
}

export type ControllerType = (
  req: Request<any>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
}

export type InvalidateCaheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string | string[];
};
