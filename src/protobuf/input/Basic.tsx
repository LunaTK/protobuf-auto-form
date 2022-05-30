import { types } from 'protobufjs';
import React from 'react';
import { useFormContext } from 'react-hook-form';

type BasicType = keyof typeof types.basic
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

export const isBasicType = (type: string): type is BasicType => protobufNumberTypes.has(type) || type === 'string' || type === 'bool';

interface Props {
  type: string
  name: string
}

const getInputType = (type: BasicType) => {
  if (type === 'bool') {
    return 'checkbox';
  } if (protobufNumberTypes.has(type)) {
    return 'number';
  }
  return 'text';
};

const BasicInput: React.FC<Props> = ({ type, name }) => {
  const { register } = useFormContext();
  return (
    <input
      {...register(name)}
      type={getInputType(type as BasicType)}
      placeholder={type}
    />
  );
};

export default BasicInput;
