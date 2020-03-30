import React from "react";

import { IAddressWithAddressType } from "@types";

import { AddressGridSelector } from "../AddressGridSelector";

import * as S from "./styles";
import { IProps } from "./types";

/**
 * Address form used in checkout.
 */
const CheckoutAddress: React.FC<IProps> = ({
  checkoutAddress,
  selectedUserAddressId,
  userAddresses,
  setShippingAddress,
}: IProps) => {
  const adresses =
    userAddresses
      ?.filter(function notEmpty<TValue>(
        value: TValue | null | undefined
      ): value is TValue {
        return value !== null && value !== undefined;
      })
      .map(address => ({
        address: {
          ...address,
          isDefaultBillingAddress: address.isDefaultBillingAddress || false,
          isDefaultShippingAddress: address.isDefaultShippingAddress || false,
          phone: address.phone || undefined,
        },
        id: address?.id || "",
        onSelect: () => null,
      })) || [];

  return (
    <S.Section>
      <S.Title>SHIPPING ADDRESS</S.Title>
      {userAddresses ? (
        <AddressGridSelector
          addresses={adresses}
          selectedAddressId={selectedUserAddressId}
          onSelect={setShippingAddress}
        />
      ) : (
        <></>
      )}
    </S.Section>
  );
};

export { CheckoutAddress };
