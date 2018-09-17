import * as React from "react";

import { Button, SelectField, TextField } from "..";
import {
  ProductDetailsInterface,
  ProductVariantInterface
} from "../../core/types";
import { CartContext } from "../Cart/context";

import "./scss/index.scss";

interface ProductDescriptionProps {
  product: ProductDetailsInterface;
  locale?: string;
}

interface ProductDescriptionState {
  pickers: Array<{ label: string; values: string[]; selected?: string }>;
  productVariants: ProductVariantInterface[];
  quantity: number;
  variants: { [x: string]: string[] };
  variant: string;
}

class ProductDescription extends React.Component<
  ProductDescriptionProps,
  ProductDescriptionState
> {
  constructor(props) {
    super(props);
    this.state = {
      pickers: [],
      productVariants: this.props.product.variants.edges.map(edge => edge.node),
      quantity: 1,
      variant: null,
      variants: {}
    };
  }

  componentDidMount() {
    if (this.state.productVariants[0].attributes.length > 0) {
      const pickers = [
        {
          label: this.state.productVariants[0].attributes[0].attribute.name,
          selected: "",
          values: []
        }
      ];

      if (this.state.productVariants[0].attributes.length > 1) {
        pickers.push({
          label: this.state.productVariants[0].attributes
            .slice(1)
            .map(attribute => attribute.attribute.name)
            .join(" / "),
          selected: "",
          values: []
        });
      }

      const variants = {};

      this.state.productVariants.map(variant => {
        if (!pickers[0].values.includes(variant.attributes[0].value.value)) {
          pickers[0].values.push(variant.attributes[0].value.value);
        }

        if (pickers[1]) {
          const combinedValues = variant.attributes
            .slice(1)
            .map(attribute => attribute.value.value)
            .join(" / ");

          if (!pickers[1].values.includes(combinedValues)) {
            pickers[1].values.push(combinedValues);
          }

          if (variants[variant.attributes[0].value.value]) {
            variants[variant.attributes[0].value.value] = [
              ...variants[variant.attributes[0].value.value],
              combinedValues
            ];
          } else {
            variants[variant.attributes[0].value.value] = [combinedValues];
          }
        }

        pickers[0].selected = pickers[0].values[0];
        if (pickers[1]) {
          pickers[1].selected = pickers[1].values[0];
        }
      });

      this.setState({
        pickers,
        variants
      });
    }
  }

  onAttribute1Change = value => {
    const pickers = this.state.pickers;
    pickers[0].selected = value;
    this.setState({ pickers });
    if (
      this.state.pickers[1] &&
      !this.state.variants[value].includes(this.state.pickers[1].selected)
    ) {
      this.onAttribute2Change("");
    }
  };

  onAttribute2Change = value => {
    const pickers = this.state.pickers;
    pickers[1].selected = value;
    this.setState({ pickers });
  };

  handleSubmit = cart => {
    let variant;
    if (this.state.pickers.length === 1) {
      variant = this.state.productVariants.find(
        variant => variant.name === `${this.state.pickers[0].selected}`
      ).id;
    } else if (this.state.pickers.length > 1) {
      variant = this.state.productVariants.find(
        variant =>
          variant.name ===
          `${this.state.pickers[0].selected} / ${
            this.state.pickers[1].selected
          }`
      ).id;
    } else {
      variant = this.state.productVariants[0].id;
    }
    cart.add(variant, this.state.quantity);
  };

  render() {
    const {
      product: { name, price, description },
      locale
    } = this.props;
    return (
      <div className="product-description">
        <h3>{name}</h3>
        <h4>
          {locale
            ? price.amount.toLocaleString(locale, {
                currency: price.currency,
                style: "currency"
              })
            : `${price.currency} ${price.amount}`}
        </h4>
        <CartContext.Consumer>
          {cart => (
            <>
              <div className="product-description__variant-picker">
                {this.state.pickers.length > 0 ? (
                  <>
                    <SelectField
                      onChange={e => this.onAttribute1Change(e.value)}
                      label={this.state.pickers[0].label}
                      key={this.state.pickers[0].label}
                      value={{
                        label: this.state.pickers[0].selected,
                        value: this.state.pickers[0].selected
                      }}
                      options={this.state.pickers[0].values.map(value => ({
                        label: value,
                        value
                      }))}
                    />
                    <div className="product-description__variant-picker__quantity">
                      {this.state.pickers[1] ? (
                        <SelectField
                          onChange={e => this.onAttribute2Change(e.value)}
                          label={this.state.pickers[1].label}
                          key={this.state.pickers[1].label}
                          value={
                            this.state.pickers[1].selected && {
                              label: this.state.pickers[1].selected,
                              value: this.state.pickers[1].selected
                            }
                          }
                          options={this.state.pickers[1].values.map(value => ({
                            isDisabled: !this.state.variants[
                              this.state.pickers[0].selected
                            ].includes(value),
                            label: value,
                            value
                          }))}
                        />
                      ) : null}
                    </div>
                  </>
                ) : null}
                <TextField
                  type="number"
                  label="Quantity"
                  value={this.state.quantity || ""}
                  onChange={e =>
                    this.setState({ quantity: Number(e.target.value) })
                  }
                />
              </div>
              <div className="product-description__about">
                <h4>Description</h4>
                <p>{description}</p>
              </div>
              <Button
                secondary
                className="product-description__action"
                onClick={() => this.handleSubmit(cart)}
                disabled={
                  this.state.pickers[1] && this.state.pickers[1].selected === ""
                }
              >
                Add to cart
              </Button>
            </>
          )}
        </CartContext.Consumer>
      </div>
    );
  }
}

export default ProductDescription;
