export type CustomerOrderStatus =
  | "placed"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled";
export type CustomerPaymentStatus = "pending" | "paid" | "failed";

export type CustomerOrderItem = {
  product: {
    _id: string;
    title: string;
    brand?: string;
    images?: string[];
    price?: number;
  };
  quantity: number;
};

export type CustomerOrder = {
  _id: string;
  code: string;
  items?: CustomerOrderItem[];
  totalItems: number;
  totalAmount: number;
  paymentStatus: CustomerPaymentStatus;
  orderStatus: CustomerOrderStatus;
  paidAt?: string | null;
  deliveredAt?: string | null;
  returnedAt?: string | null;
  createdAt: string;
};

export type CustomerOrdersResponse = {
  items: CustomerOrder[];
};

export type CustomerReturnOrderResponse = {
  _id: string;
  orderStatus: CustomerOrderStatus;
  returnedAt?: string | null;
};

export type CustomerCancelOrderResponse = {
  _id: string;
  orderStatus: CustomerOrderStatus;
};
