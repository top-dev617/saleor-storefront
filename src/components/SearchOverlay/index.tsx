import * as React from "react";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import ReactSVG from "react-svg";

import { Button, TextField } from "..";
import { OverlayContext, OverlayType } from "../App/context";
import { Overlay } from "../Overlay";
import { GET_SEARCH_RESULTS } from "./queries";

import "./scss/index.scss";

class SearchOverlay extends React.Component<{}, { search: string }> {
  constructor(props) {
    super(props);
    this.state = { search: "" };
  }

  render() {
    return (
      <OverlayContext.Consumer>
        {overlayContext => {
          if (overlayContext.type === OverlayType.search) {
            return (
              <Overlay
                type={OverlayType.search}
                onClose={() => {
                  overlayContext.hide();
                  this.setState({ search: "" });
                }}
              >
                <div
                  className={`search${
                    this.state.search ? " search--full-height" : ""
                  }`}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="search__input">
                    <TextField
                      icon={<ReactSVG path="../../images/search.svg" />}
                      autoFocus={true}
                      onChange={e => this.setState({ search: e.target.value })}
                    />
                  </div>
                  {this.state.search ? (
                    <>
                      <div className="search__products">
                        <Query
                          query={GET_SEARCH_RESULTS}
                          variables={{ query: this.state.search }}
                        >
                          {({ loading, error, data }) => {
                            if (loading) {
                              return "Loading";
                            }
                            if (error) {
                              return `Error!: ${error}`;
                            }
                            return (
                              <>
                                <ul>
                                  {data.products.edges.map(item => (
                                    <li
                                      key={item.node.id}
                                      className="search__products__item"
                                    >
                                      <Link to={item.node.url}>
                                        <img src={item.node.thumbnailUrl} />
                                        <span>
                                          <h4>{item.node.name}</h4>
                                          <p>{item.node.category.name}</p>
                                        </span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                                <div className="search__products__footer">
                                  <Button>Show all results</Button>
                                </div>
                              </>
                            );
                          }}
                        </Query>
                      </div>
                    </>
                  ) : null}
                </div>
              </Overlay>
            );
          }
        }}
      </OverlayContext.Consumer>
    );
  }
}

export default SearchOverlay;
