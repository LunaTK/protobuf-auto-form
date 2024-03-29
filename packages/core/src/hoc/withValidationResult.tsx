import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';
import React from 'react';
import { InputProps } from '../models';
import { clsx } from 'clsx';
import { makeHocName } from '../utils';

const withValidationResult = <T extends InputProps>(Component: React.FC<T>) => {
  const Wrapped: React.FC<T> = (props) => {
    const {
      formState: { errors },
    } = useFormContext();
    const error = get(errors, props.name);
    const errorLabel = error && error.message && (
      <div className="text-xs text-red-500 p-1">{error.message}</div>
    );
    const original = Component({ ...props, error });

    if (props.options?.flatten) {
      return (
        <>
          {original}
          {errorLabel}
        </>
      );
    }

    return (
      <div
        className={clsx(
          'form-control w-auto',
          error && 'border input-error border-dotted border-red-400 rounded-lg',
        )}
      >
        {original}
        {errorLabel}
      </div>
    );
  };
  Wrapped.displayName = makeHocName(withValidationResult, Component);

  return Wrapped;
};

export default withValidationResult;
