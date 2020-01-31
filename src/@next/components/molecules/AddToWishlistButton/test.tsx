import { shallow } from "enzyme";
import "jest-styled-components";
import React from "react";

import { AddToWishlistButton } from ".";

describe("<AddToWishlistButton />", () => {
  it("exists", () => {
    const wrapper = shallow(
      <AddToWishlistButton added={false} onClick={() => null} />
    );

    expect(wrapper.exists()).toEqual(true);
  });
});
