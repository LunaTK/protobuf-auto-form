import React from 'react';
import { useChildFields } from '../hooks';
import { FieldOptions } from '../models';

const withPrependAppend =
  <T extends { options?: FieldOptions }>(
    Component: React.FunctionComponent<T>,
  ) =>
  (props: T) => {
    const { append, prepend, ...rest } = props.options ?? {};
    const { otherNodes } = useChildFields(props.options);

    return (
      <>
        {prepend}
        <Component {...props} options={rest} />
        {append}
        {otherNodes}
      </>
    );
  };

export default withPrependAppend;
