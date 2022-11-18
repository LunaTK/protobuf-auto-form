import { types } from 'protobufjs';
import React from 'react';
import { useFormContext, Validate } from 'react-hook-form';
import get from 'lodash.get';
import { FieldOptions } from '../../../models';

type BasicType = keyof typeof types.basic;
const protobufNumberTypes = new Set([
  'double',
  'float',
  'int32',
  'uint32',
  'sint32',
  'fixed32',
  'sfixed32',
  'int64',
  'uint64',
  'sint64',
  'fixed64',
  'sfixed64',
]);

export const isBasicType = (type: string): type is BasicType =>
  protobufNumberTypes.has(type) || type === 'string' || type === 'bool';

interface Props {
  type: string;
  name: string;
  validate?: Validate<unknown>;
  options?: FieldOptions;
}

const getInputType = (type: BasicType) => {
  if (type === 'bool') {
    return 'checkbox';
  }
  if (protobufNumberTypes.has(type)) {
    return 'number';
  }
  return 'text';
};

const BasicInput: React.FC<Props> = ({ type, name, validate, options }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name);

  return (
    <div className="form-control w-auto">
      <input
        className={`input input-bordered input-sm ${
          type !== 'bool' ? 'flex-1' : ''
        } ${error ? 'input-error' : ''}`}
        {...register(name, {
          ...options?.rules,
          validate: {
            ...(typeof options?.rules?.validate === 'function'
              ? { userDefined: options?.rules?.validate }
              : options?.rules?.validate),
            ...(validate && { autoformValidation: validate }),
          },
        })}
        type={getInputType(type as BasicType)}
        placeholder={type}
        step="any"
        readOnly={options?.readOnly}
      />
      {error && <div className="text-xs text-red-500 p-1">{error.message}</div>}
    </div>
  );
};

export default BasicInput;
