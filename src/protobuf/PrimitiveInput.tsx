import React from 'react';
import protobuf from 'protobufjs';
import { Controller, useFormContext } from 'react-hook-form';
import BasicInput, { isBasicType } from './input/Basic';
import EnumInput from './input/Enum';
import Message from './input/Message';
import { useGetWellKnownComponent } from '../hooks';
import { FieldOptions } from '../AutoFormField';

interface InputProps {
  field: protobuf.Field
  name: string
  options?: FieldOptions
}

const PrimitiveInput: React.FC<InputProps> = ({
  field, options, name,
}) => {
  const { resolvedType, type } = field;
  const { control } = useFormContext();
  const getWellKnownComponent = useGetWellKnownComponent();

  const WellKnownComponent = getWellKnownComponent(field);
  if (WellKnownComponent) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <WellKnownComponent
            value={value}
            onChange={onChange}
          />
        )}
      />
    );
  }

  if (isBasicType(type)) {
    return <BasicInput name={name} type={type} options={options} />;
  } if (resolvedType instanceof protobuf.Enum) {
    return <EnumInput name={name} type={resolvedType} options={options} />;
  } if (resolvedType instanceof protobuf.Type) {
    return <Message name={name} type={resolvedType} options={options} />;
  }

  throw new Error(`Unresolved type "${type}" from field "${name}"`);
};

export default PrimitiveInput;
