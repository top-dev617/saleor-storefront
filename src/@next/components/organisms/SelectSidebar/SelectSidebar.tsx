import { Trans } from "@lingui/react";
import React from "react";

import { ButtonLink } from "@components/atoms";
import { CardHeader, OverlayItem } from "@components/molecules";
import { useHandlerWhenClickedOutside } from "@hooks";

import { Overlay } from "../";
import * as S from "./styles";
import { IProps } from "./types";

export const SelectSidebar: React.FC<IProps> = ({
  title,
  options = [],
  disabled = [],
  selected = [],
  hide,
  onSelect,
  show,
  target,
}: IProps) => {
  const { setElementRef } = useHandlerWhenClickedOutside(() => {
    hide();
  });

  return (
    <Overlay
      position="right"
      show={show}
      hide={hide}
      transparent
      target={target}
    >
      <S.Wrapper ref={setElementRef()}>
        <CardHeader divider onHide={hide}>
          <span>{title}</span>
        </CardHeader>
        <S.Content>
          {options.map(option => {
            const isSelected = selected.some(value => value === option.value);

            return (
              <S.Option key={option.value}>
                <OverlayItem
                  selected={isSelected}
                  onClick={() => onSelect(option.value)}
                >
                  {option.label}
                </OverlayItem>
              </S.Option>
            );
          })}
        </S.Content>
        <S.Footer>
          <ButtonLink color="secondary">
            <Trans id="Show size table" />
          </ButtonLink>
        </S.Footer>
      </S.Wrapper>
    </Overlay>
  );
};
