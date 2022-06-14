import React from 'react';
import protobuf from 'protobufjs';
import RepeatedInput from './input/Repeated';
import MapInput from './input/Map';
import { FieldOptions } from '../AutoFormField';
import PrimitiveInput from './PrimitiveInput';

interface InputProps {
  field: protobuf.Field
  parentName: string
  ignoreRepeatAndMap?: boolean
  options?: FieldOptions
}

const Input: React.FC<InputProps> = ({
  field, options, parentName, ignoreRepeatAndMap,
}) => {
  const { repeated } = field;
  const name = parentName ? `${parentName}.${field.name}` : field.name;

  if (!ignoreRepeatAndMap && repeated) {
    return <RepeatedInput field={field} name={name} />;
  } if (!ignoreRepeatAndMap && field instanceof protobuf.MapField) {
    return <MapInput name={name} field={field} keyType={field.keyType} />;
  }

  return <PrimitiveInput field={field} name={name} options={options} />;
};

export default Input;
