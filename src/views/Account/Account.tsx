import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { useAuth, useUserDetails } from "@sdk/react";
import AddressBook from "../../account/AddressBook/AddressBook";

import "./scss/index.scss";

import {
  accountUrl,
  addressBookUrl,
  baseUrl,
  orderHistoryUrl,
  paymentOptionsUrl
} from "../../routes";

import { AccountMenu } from "@components/molecules";
import { OrdersHistory } from "@components/views";
import HelloPrompt from "../../account/HelloPrompts";
import { Loader } from "../../components";

const returnTab: any = (path: string, userDetails, history) => {
  let tabContent = <></>;
  switch (path) {
    case addressBookUrl: {
      tabContent = <AddressBook user={userDetails} />;
      break;
    }
    case orderHistoryUrl: {
      tabContent = <OrdersHistory {...{ history }} />;
      break;
    }
  }
  return tabContent;
};

const Account: React.FC<RouteComponentProps> = ({ history, match }) => {
  const { authenticated } = useAuth();
  const { data: user, loading } = useUserDetails();

  const links = [
    accountUrl,
    orderHistoryUrl,
    addressBookUrl,
    paymentOptionsUrl,
  ];

  if (!authenticated) {
    history.push(baseUrl);
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container">
      <HelloPrompt name={user.firstName} />
      <div className="account">
        <div className="account__menu">
          <AccountMenu links={links} active={match.path} />
        </div>
        <div className="account__content">
          {returnTab(match.path, user, history)}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Account);
