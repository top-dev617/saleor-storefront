import React from "react";

import { TaxedMoney } from "@components/containers";
import { CachedImage } from "../CachedImage";

import * as S from "./styles";
import { IProps } from "./types";

/**
 * Row with product to display in cart summary.
 */
const CartSummaryRow: React.FC<IProps> = ({
  index,
  sku,
  name,
  price,
  quantity,
  thumbnail,
}: IProps) => {
  return (
    <S.Wrapper data-test="cartSummary" data-test-id={sku}>
      <S.Name data-test="name">{name}</S.Name>
      <S.Sku>
        SKU: <span data-test="sku">{sku}</span>
      </S.Sku>
      <S.Quantity>
        Quantity: <span data-test="quantity">{quantity}</span>
      </S.Quantity>
      <S.Price data-test="price">
        <TaxedMoney taxedMoney={price} />
      </S.Price>
      <S.Photo>
        <CachedImage data-test="image" {...thumbnail} />
      </S.Photo>
    </S.Wrapper>
  );
};

export { CartSummaryRow };
