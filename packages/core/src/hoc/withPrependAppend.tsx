import React from 'react';
import { FieldOptions } from '../models';
import { makeHocName } from '../utils';

const withPrependAppend = <T extends { options?: FieldOptions }>(
  Component: React.FC<T>,
) => {
  const Wrapped: React.FC<T> = (props: T) => {
    const { append, prepend, ...rest } = props.options ?? {};

    return (
      <>
        {prepend}
        {Component({ ...props, options: rest })}
        {append}
      </>
    );
  };
  Wrapped.displayName = makeHocName(withPrependAppend, Component);

  return Wrapped;
};

export default withPrependAppend;
