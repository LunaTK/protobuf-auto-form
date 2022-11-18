import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';
import React from 'react';
import { InputProps } from '../models';

const withValidationResult = <T extends InputProps>(
  Component: React.FC<T>,
) => {
  const Wrapped: React.FC<T> = (props) => {
    const {
      formState: { errors },
    } = useFormContext();
    const error = get(errors, props.name);

    return (
      <div className="form-control w-auto">
        <Component {...props} error={error} />
        {error && (
          <div className="text-xs text-red-500 p-1">{error.message}</div>
        )}
      </div>
    );
  };
  Wrapped.displayName = `withValidationResult(${Component.name})`;

  return Wrapped;
};

export default withValidationResult;
