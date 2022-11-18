import React from 'react';
import protobuf from 'protobufjs';
import RepeatedInput from './complex/Repeated';
import MapInput from './complex/Map';
import { FieldOptions } from '../../models';
import PrimitiveInput from './primitive/PrimitiveInput';
import { Controller, useFormContext } from 'react-hook-form';

interface InputProps {
  field: protobuf.Field;
  parentName: string;
  ignoreRepeatAndMap?: boolean;
  options?: FieldOptions;
}

const Input: React.FC<InputProps> = ({
  field,
  options,
  parentName,
  ignoreRepeatAndMap,
}) => {
  const { repeated } = field;
  const { control, watch } = useFormContext();
  const name = parentName ? `${parentName}.${field.name}` : field.name;

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

  if (!ignoreRepeatAndMap && repeated) {
    return <RepeatedInput field={field} name={name} options={options} />;
  }
  if (!ignoreRepeatAndMap && field instanceof protobuf.MapField) {
    return (
      <MapInput
        name={name}
        field={field}
        keyType={field.keyType}
        options={options}
      />
    );
  }

  return <PrimitiveInput field={field} name={name} options={options} />;
};

export default Input;
