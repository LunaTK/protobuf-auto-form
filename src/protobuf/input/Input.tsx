import React from 'react';
import protobuf from 'protobufjs';
import RepeatedInput from './Repeated';
import MapInput from './Map';
import { FieldOptions } from '../../AutoFormField';
import PrimitiveInput from './primitive/PrimitiveInput';

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
    return <RepeatedInput field={field} name={name} options={options} />;
  } if (!ignoreRepeatAndMap && field instanceof protobuf.MapField) {
    return <MapInput name={name} field={field} keyType={field.keyType} options={options} />;
  }

  return <PrimitiveInput field={field} name={name} options={options} />;
};

export default Input;
