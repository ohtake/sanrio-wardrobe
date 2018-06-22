import React from 'react';

const SetTitleContext = React.createContext(() => {});
const ThumbnailSizeContext = React.createContext(120);

export default {
  SetTitleContext,
  ThumbnailSizeContext,
};
