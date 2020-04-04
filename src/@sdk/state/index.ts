import { NamedObservable } from "../helpers";
import { CheckoutNetworkManager } from "../network";
import { ApolloErrorWithUserInput } from "../react/types";
import {
  ICheckoutModel,
  IPaymentModel,
  LocalRepository,
  LocalStorageItems,
} from "../repository";
import { ISaleorState, StateItems } from "./types";

export class SaleorState extends NamedObservable<StateItems>
  implements ISaleorState {
  checkout?: ICheckoutModel;
  promoCode?: string;
  selectedShippingAddressId?: string;
  selectedBillingAddressId?: string;
  payment?: IPaymentModel;

  private repository: LocalRepository;
  private checkoutNetworkManager: CheckoutNetworkManager;

  constructor(
    repository: LocalRepository,
    checkoutNetworkManager: CheckoutNetworkManager
  ) {
    super();
    this.repository = repository;
    this.checkoutNetworkManager = checkoutNetworkManager;

    repository.subscribeToChange(
      LocalStorageItems.CHECKOUT,
      this.updateCheckout
    );
  }

  provideCheckout = async (
    onError: (error: ApolloErrorWithUserInput | any) => any,
    forceReload?: boolean
  ) => {
    if (this.isCheckoutCreatedOnline() && !forceReload) {
      return;
    }

    if (navigator.onLine) {
      await this.provideCheckoutOnline(onError);
    } else {
      this.provideCheckoutOffline(forceReload);
    }
  };

  updateSelectedShippingAddressId = (selectedShippingAddressId?: string) => {
    this.selectedShippingAddressId = selectedShippingAddressId;
    this.notifyChange(
      StateItems.SELECTED_SHIPPING_ADDRESS_ID,
      this.selectedShippingAddressId
    );
  };

  updateSelectedBillingAddressId = (selectedBillingAddressId?: string) => {
    this.selectedBillingAddressId = selectedBillingAddressId;
    this.notifyChange(
      StateItems.SELECTED_BILLING_ADDRESS_ID,
      this.selectedBillingAddressId
    );
  };

  private updateCheckout = (checkout: ICheckoutModel) => {
    this.checkout = checkout;
    this.notifyChange(StateItems.CHECKOUT, this.checkout);
  };

  private isCheckoutCreatedOnline = () => this.checkout?.id;

  private provideCheckoutOnline = async (
    onError: (error: ApolloErrorWithUserInput | any) => any
  ) => {
    // 1. Try to take checkout from backend database
    const checkout = this.repository.getCheckout();

    const { data, errors } = await this.checkoutNetworkManager.getCheckout(
      checkout?.token
    );

    if (errors) {
      onError(errors);
    } else if (data) {
      this.repository.setCheckout(data);
      // this.updateCheckout(data);
      return;
    }

    // 2.a. Try to take checkout from local storage
    const checkoutModel: ICheckoutModel | null = this.repository.getCheckout();
    if (checkoutModel && checkoutModel.id) {
      this.updateCheckout(checkoutModel);
      return;
    }

    // 2.b. Try to take new created checkout from backend
    if (checkoutModel && !checkoutModel.id) {
      const { email, shippingAddress, billingAddress, lines } = checkoutModel;
      if (email && shippingAddress && lines) {
        const alteredLines = lines.map(item => ({
          quantity: item!.quantity,
          variantId: item?.variant!.id,
        }));

        const {
          data,
          errors,
        } = await this.checkoutNetworkManager.createCheckout(
          email,
          alteredLines,
          shippingAddress,
          billingAddress || undefined
        );

        if (errors) {
          onError(errors);
        } else if (data) {
          this.repository.setCheckout(data);
          // this.updateCheckout(data);
          return;
        } else {
          this.updateCheckout(checkoutModel);
          return;
        }
      } else {
        this.updateCheckout(checkoutModel);
        return;
      }
    }
  };

  private provideCheckoutOffline = (forceReload?: boolean) => {
    // 1. Try to take checkout from runtime memory (if exist in memory - has any checkout data)
    if (this.checkout && !forceReload) {
      return;
    }

    // 2. Try to take checkout from local storage
    let checkoutModel: ICheckoutModel | null;
    checkoutModel = this.repository.getCheckout();

    if (checkoutModel) {
      this.updateCheckout(checkoutModel);
      return;
    }
  };
}
