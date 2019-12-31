import { storiesOf } from "@storybook/react";
import React from "react";

import { action } from "@storybook/addon-actions";

import { SelectSidebar } from ".";
import { DEFAULT_PROPS } from "./testData";

let portalRoot = document.getElementById("portal-root");
if (!portalRoot) {
  portalRoot = document.createElement("div");
  portalRoot.setAttribute("id", "portal-root");
  document.body.appendChild(portalRoot);
}

storiesOf("@components/organisms/SelectSidebar", module).add("default", () => (
  <SelectSidebar
    target={portalRoot}
    {...DEFAULT_PROPS}
    hide={action("hide")}
    onSelect={action("onSelect")}
  />
));
