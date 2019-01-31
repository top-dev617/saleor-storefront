import "./scss/index.scss";

import * as React from "react";

import { Checkout } from "../../checkout/types/Checkout";
import { maybe, priceToString } from "../../core/utils";
import { TypedProductVariantsQuery } from "../../views/Product/queries";
import { CartInterface } from "../CartProvider/context";
import { ShopContext } from "../ShopProvider/context";
import Line from "./Line";

const CartSummary: React.FC<{
  cart: CartInterface;
  checkout: Checkout | null;
}> = ({ cart, checkout }) => {
  const delivery = maybe(() => checkout.shippingPrice.gross.localized, "-");
  const grandTotal = maybe(() => checkout.totalPrice.gross.localized, "-");
  const subtotal = (
    <ShopContext.Consumer>
      {({ defaultCountry, geolocalization }) => (
        <>
          {checkout
            ? checkout.subtotalPrice.gross.localized
            : priceToString(
                cart.getTotal(),
                geolocalization.country
                  ? geolocalization.country.code
                  : defaultCountry.code
              )}
        </>
      )}
    </ShopContext.Consumer>
  );

  return (
    <div className="cart-summary">
      <p className="cart-summary__header">Cart summary</p>

      {!checkout ? (
        <TypedProductVariantsQuery
          variables={{ ids: cart.lines.map(line => line.variantId) }}
        >
          {({ data }) =>
            data.productVariants.edges.map(({ node }) => (
              <Line
                key={node.id}
                {...node}
                quantity={
                  cart.lines.find(({ variantId }) => variantId === node.id)
                    .quantity
                }
              />
            ))
          }
        </TypedProductVariantsQuery>
      ) : (
        checkout.lines.map(({ variant, quantity, id }) => (
          <Line key={id} {...variant} quantity={quantity} />
        ))
      )}

      <div className="cart-summary__totals">
        <h4>Subtotal</h4>
        <h4>{subtotal}</h4>
      </div>
      <div className="cart-summary__totals">
        <h4>Delivery</h4>
        <h4>{delivery}</h4>
      </div>
      <div className="cart-summary__totals last">
        <h4>Grand total</h4>
        <h4>{grandTotal}</h4>
      </div>
    </div>
  );
};

export default CartSummary;
