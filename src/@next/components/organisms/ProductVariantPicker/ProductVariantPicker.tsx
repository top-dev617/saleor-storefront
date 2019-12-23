import React, { useEffect, useState } from "react";

import { TextField } from "@components/molecules";
import { ProductDetails_product_variants } from "@sdk/queries/types/ProductDetails";

import { ProductAttributeInputSelect } from "./ProductAttributeInputSelect";
import * as S from "./styles";
import {
  IProductVariableAttributes,
  IProductVariableAttributesSelectedValue,
  IProps,
} from "./types";

export const useProductVariableAttributes = (
  productVariants: ProductDetails_product_variants[]
): IProductVariableAttributes => {
  const [productVariableAttributes, setProductVariableAttributes] = useState<
    IProductVariableAttributes
  >({});

  useEffect(() => {
    const varibleAttributes: IProductVariableAttributes = {};

    productVariants.forEach(productVariant => {
      productVariant.attributes.forEach(productVariantAttribute => {
        const productVariantAttributeId = productVariantAttribute.attribute.id;
        const varibleAttributeExists = varibleAttributes.hasOwnProperty(
          productVariantAttributeId
        );

        if (varibleAttributeExists) {
          const varibleAttributeValueExists = varibleAttributes[
            productVariantAttributeId
          ].values.includes(productVariantAttribute.value!);

          if (!varibleAttributeValueExists) {
            varibleAttributes[productVariantAttributeId].values.push(
              productVariantAttribute.value!
            );
          }
        } else {
          varibleAttributes[productVariantAttributeId] = {
            attribute: productVariantAttribute.attribute,
            values: [productVariantAttribute.value!],
          };
        }
      });
    });

    setProductVariableAttributes(varibleAttributes);
  }, [productVariants]);

  return productVariableAttributes;
};

const useProductVariableAttributesSelectedValue = (
  productVariableAttributes: IProductVariableAttributes
): [
  IProductVariableAttributesSelectedValue,
  (
    selectedProductVariableAttributeId: string,
    selectedProductVariableAttributeValue: string
  ) => void
] => {
  const [
    productVariableAttributesSelectedValue,
    setProductVariableAttributesSelectedValue,
  ] = useState<IProductVariableAttributesSelectedValue>({});

  useEffect(() => {
    const variableAttributesSelectedValue: IProductVariableAttributesSelectedValue = {};
    Object.keys(productVariableAttributes).forEach(
      productVariableAttributeId => {
        variableAttributesSelectedValue[productVariableAttributeId] = null;
      }
    );
  }, []);

  const selectProductVariableAttributesValue = (
    selectedProductVariableAttributeId: string,
    selectedProductVariableAttributeValue: string
  ) => {
    setProductVariableAttributesSelectedValue(
      prevVariableAttributesSelectedValue => {
        const newVariableAttributesSelectedValue: IProductVariableAttributesSelectedValue = {};

        Object.keys(productVariableAttributes).forEach(
          productVariableAttributeId => {
            if (
              productVariableAttributeId === selectedProductVariableAttributeId
            ) {
              const selectedValue =
                productVariableAttributes[
                  productVariableAttributeId
                ].values.find(
                  value => value.value === selectedProductVariableAttributeValue
                ) || null;
              newVariableAttributesSelectedValue[
                productVariableAttributeId
              ] = selectedValue;
            } else {
              newVariableAttributesSelectedValue[productVariableAttributeId] =
                prevVariableAttributesSelectedValue[productVariableAttributeId];
            }
          }
        );

        return newVariableAttributesSelectedValue;
      }
    );
  };

  return [
    productVariableAttributesSelectedValue,
    selectProductVariableAttributesValue,
  ];
};

export const ProductVariantPicker: React.FC<IProps> = ({
  productVariants = [],
}: IProps) => {
  const productVariableAttributes = useProductVariableAttributes(
    productVariants
  );
  const [
    productVariableAttributesSelectedValue,
    selectProductVariableAttributesValue,
  ] = useProductVariableAttributesSelectedValue(productVariableAttributes);

  return (
    <S.Wrapper>
      {Object.keys(productVariableAttributes).map(
        productVariableAttributeId => (
          <ProductAttributeInputSelect
            key={productVariableAttributeId}
            productVariants={productVariants}
            productVariableAttributeId={productVariableAttributeId}
            productVariableAttribute={
              productVariableAttributes[productVariableAttributeId]
            }
            productVariableAttributesSelectedValue={
              productVariableAttributesSelectedValue
            }
            onChange={optionValue =>
              selectProductVariableAttributesValue(
                productVariableAttributeId,
                optionValue.value
              )
            }
          />
        )
      )}
      <TextField
        name="quantity"
        label="Quantity"
        autoComplete="given-name"
        // {...basicInputProps()}
      />
      {/* --- here --- */}
    </S.Wrapper>
  );
};
