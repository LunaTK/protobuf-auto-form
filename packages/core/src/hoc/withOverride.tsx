import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useGetWellKnownComponent } from '../hooks';
import { FieldOptions } from '../models';
import { makeHocName } from '../utils';

const withOverride = <
  T extends {
    options?: FieldOptions;
    name: string;
    field: protobuf.Field;
    index?: number;
  },
>(
  Component: React.FC<T>,
) => {
  const Wrapped: React.FC<T> = (props: T) => {
    const { options, name, field, index } = props;
    const { control, watch } = useFormContext();
    const { render, rules } = options ?? {};
    const getWellKnownComponent = useGetWellKnownComponent();

    if (render) {
      return (
        <Controller
          name={name}
          control={control}
          render={({ field: fieldProps }) => render({ ...fieldProps, watch })!}
          rules={rules}
        />
      );
    }

    const WellKnownComponent = getWellKnownComponent(field);
    if (WellKnownComponent) {
      return (
        <Controller
          name={name}
          control={control}
          render={({ field: fieldProps }) => (
            <WellKnownComponent watch={watch} index={index} {...fieldProps} />
          )}
          rules={rules}
        />
      );
    }

    return <Component {...props} />;
  };
  Wrapped.displayName = makeHocName(withOverride, Component);

  return Wrapped;
};

export default withOverride;

export const withOverrideType = <
  T extends {
    options?: FieldOptions;
    name: string;
    type: string;
  },
>(
  Component: React.FC<T>,
) => {
  const Wrapped: React.FC<T> = (props: T) => {
    const { options, name, type: __type } = props;
    const { control, watch } = useFormContext();
    const { render, rules } = options ?? {};

    if (render) {
      return (
        <Controller
          name={name}
          control={control}
          render={({ field: fieldProps }) => render({ ...fieldProps, watch })!}
          rules={rules}
        />
      );
    }

    return <Component {...props} />;
  };
  Wrapped.displayName = makeHocName(withOverride, Component);

  return Wrapped;
};
