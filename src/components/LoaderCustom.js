import React from 'react';
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border:7px solid #588c7e;
`;
export const LoaderCustom=()=> {
  return <ClipLoader color={'#ffffff'} loading={true} css={override} size={150} />
}
