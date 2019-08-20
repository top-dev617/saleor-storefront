import * as React from "react";
import { generatePath } from "react-router";

import { useUserDetails } from "@sdk/react";

import { FormAddressType } from "../../../components";
import { maybe } from "../../../core/utils";
import {
  CartSummary,
  GuestAddressForm,
  StepCheck,
  Steps,
  UserAddressSelector
} from "../../components";
import { CheckoutStep } from "../../context";
import { paymentUrl } from "../../routes";
import { CheckoutFormType } from "../../types";
import { Checkout } from "../../types/Checkout";
import { IBillingPageProps } from "./types";

const computeMutationVariables = (
  formData: FormAddressType,
  checkout: Checkout,
  shippingAsBilling: boolean
) => {
  const { shippingAddress } = checkout;
  const data = shippingAsBilling
    ? (shippingAddress as FormAddressType)
    : formData;

  return {
    billingAddress: {
      city: data.city,
      country: maybe(() => data.country.value, data.country.code),
      countryArea: data.countryArea,
      firstName: data.firstName,
      lastName: data.lastName,
      postalCode: data.postalCode,
      streetAddress1: data.streetAddress1,
      streetAddress2: data.streetAddress2,
    },
    checkoutId: checkout.id,
  };
};

const View: React.FC<IBillingPageProps> = ({
  checkout,
  validateStep,
  proceedToNextStepData,
  path,
  saveBillingAddress,
  shippingAsBilling,
  shop,
  step,
  update,
}) => {
  const [errors, setErrors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const onSaveBillingAddressHandler = async (formData: FormAddressType) => {
    setLoading(true);
    const { data, errors } = await saveBillingAddress(
      computeMutationVariables(formData, checkout, shippingAsBilling)
    );
    setLoading(false);
    return { data, errors };
  };

  const onSubmitHandler = async (formData: FormAddressType) => {
    const { errors } = await onSaveBillingAddressHandler(formData);
    setErrors(errors);
    return errors;
  };

  const onProceedToShippingSubmit = async (formData: FormAddressType) => {
    const { history, token, update } = proceedToNextStepData;

    const { data, errors } = await onSaveBillingAddressHandler(formData);
    const canProceed = !errors.length;

    if (canProceed) {
      update({
        checkout: data.checkout || checkout,
      });
      history.push(generatePath(paymentUrl, { token }));
    } else {
      setErrors(errors);
    }
  };

  const billingProps = {
    buttonText: "Proceed to Payment",
    checkout,
    errors,
    loading,
    proceedToNextStep: onProceedToShippingSubmit,
    shippingAsBilling,
    type: "billing" as CheckoutFormType,
  };

  const { data: user } = useUserDetails();

  return validateStep ? (
    <StepCheck
      step={step}
      checkout={checkout}
      path={path}
      token={proceedToNextStepData.token}
    />
  ) : (
    <CartSummary checkout={checkout}>
      <Steps
        step={CheckoutStep.BillingAddress}
        token={proceedToNextStepData.token}
        checkout={checkout}
      >
        <>
          <div className="address-form__copy-address">
            <label className="checkbox">
              <input
                name="asBilling"
                type="checkbox"
                checked={shippingAsBilling}
                onChange={({ target: { checked } }) =>
                  update({
                    shippingAsBilling: checked,
                  })
                }
              />
              <span>Same as Shipping Address</span>
            </label>
          </div>
          {user ? (
            <UserAddressSelector
              update={update}
              user={user}
              onSubmit={onSubmitHandler}
              {...billingProps}
            />
          ) : (
            <GuestAddressForm
              key={`${shippingAsBilling}`}
              shop={shop}
              {...billingProps}
            />
          )}
        </>
      </Steps>
    </CartSummary>
  );
};

export default View;
