import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import * as React from "react";
import { render } from "react-dom";

import { GlobalRouting, UserProvider } from "./components";
import { OverlayProvider } from "./components/Overlay";
import { OverlayContext, OverlayType } from "./components/Overlay/context";
import {
  authLink,
  invalidTokenLinkWithTokenHandlerComponent
} from "./core/auth";

const devMode = process.env.NODE_ENV !== "production";
const cache = new InMemoryCache();
const {
  component: UserProviderWithTokenHandler,
  link: invalidTokenLink
} = invalidTokenLinkWithTokenHandlerComponent(UserProvider);

const link = ApolloLink.from([
  invalidTokenLink,
  authLink,
  new HttpLink({
    uri: process.env.APP_GRAPHQL_URL || "/graphql/"
  })
]);

persistCache({
  cache,
  debug: devMode,
  storage: window.localStorage
});

const apolloClient = new ApolloClient({ cache, link });

render(
  <OverlayProvider>
    <OverlayContext.Consumer>
      {({ show }) => (
        <UserProviderWithTokenHandler
          apolloClient={apolloClient}
          onUserLogin={() =>
            show(OverlayType.message, null, {
              title: "You are logged in"
            })
          }
          onUserLogout={() =>
            show(OverlayType.message, null, {
              title: "You are logged out"
            })
          }
          refreshUser
        >
          <GlobalRouting apolloClient={apolloClient} />
        </UserProviderWithTokenHandler>
      )}
    </OverlayContext.Consumer>
  </OverlayProvider>,
  document.getElementById("root")
);
