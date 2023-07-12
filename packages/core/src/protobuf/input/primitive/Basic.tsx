import { types } from 'protobufjs';
import React from 'react';
import { useFormContext, Validate } from 'react-hook-form';
import { FieldOptions, InputProps } from '../../../models';
import { withOverrideType } from '../../../hoc/withOverride';

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

interface Props extends InputProps {
  type: string;
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

const BasicInput: React.FC<Props> = ({
  type,
  name,
  validate,
  options,
  error,
}) => {
  const { register } = useFormContext();
  const inputType = getInputType(type as BasicType);

  return (
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
        valueAsNumber: inputType === 'number',
      })}
      type={inputType}
      placeholder={type}
      step="any"
      readOnly={options?.readOnly}
    />
  );
};

export default withOverrideType(BasicInput);
