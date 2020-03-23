import {
  Checkout_lines_totalPrice_gross,
  Checkout_lines_totalPrice_net,
  Checkout_lines_variant_pricing,
  Checkout_lines_variant_product,
} from "../fragments/types/Checkout";

export enum LocalStorageItems {
  JOB_QUEUE_CHECKOUT = "job_queueCheckout",
  CHECKOUT = "data_checkout",
  CHECKOUT_TOKEN = "data_checkoutToken",
}

export interface ICheckoutModelLineTotalPrice {
  gross: Checkout_lines_totalPrice_gross;
  net: Checkout_lines_totalPrice_net;
}

export interface ICheckoutModelLineVariant {
  stockQuantity: number | undefined;
  id: string;
  name: string | undefined;
  sku: string | undefined;
  pricing: Checkout_lines_variant_pricing | null | undefined;
  product: Checkout_lines_variant_product | undefined;
}

export interface ICheckoutModelLine {
  quantity: number;
  id: string | undefined;
  variant: ICheckoutModelLineVariant;
  totalPrice: ICheckoutModelLineTotalPrice | null | undefined;
}

export interface ICheckoutModel {
  id: string | undefined;
  email: string | undefined;
  shippingAddress: object | null | undefined;
  billingAddress: object | null | undefined;
  lines: ICheckoutModelLine[] | null | undefined;
}

export interface IJobsModel {
  checkout: {
    setCartItem: boolean;
  };
}

export interface ILocalRepository {
  getCheckout(): ICheckoutModel | null;
  setCheckout(checkout: ICheckoutModel | null): void;
  getCheckoutToken(): string | null;
  setCheckoutToken(token: string): void;
}
