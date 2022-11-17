import React from 'react';
import { FieldOptions } from '../models';

const withPrependAppend =
  <T extends { options?: FieldOptions }>(
    Component: React.FunctionComponent<T>,
  ) =>
  (props: T) => {
    const { append, prepend, ...rest } = props.options ?? {};

    return (
      <>
        {prepend}
        <Component {...props} options={rest} />
        {append}
      </>
    );
  };

export default withPrependAppend;
