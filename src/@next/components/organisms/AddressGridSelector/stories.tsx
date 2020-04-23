import { storiesOf } from "@storybook/react";
import React from "react";

import { AddressGridSelector } from ".";
import { DEFAULT_PROPS } from "./fixtures";

let portalRoot = document.getElementById("modal-root");
if (!portalRoot) {
  portalRoot = document.createElement("div");
  portalRoot.setAttribute("id", "modal-root");
  document.body.appendChild(portalRoot);
}

storiesOf("@components/organisms/AddressGridSelector", module)
  .addParameters({ component: AddressGridSelector })
  .add("default", () => (
    <AddressGridSelector {...DEFAULT_PROPS} onSelect={() => null} />
  ));
