import React from 'react';
import protobuf from 'protobufjs';
import { Controller, useFormContext } from 'react-hook-form';
import BasicInput, { isBasicType } from './Basic';
import EnumInput from './Enum';
import Message from './Message';
import { useGetWellKnownComponent } from '../../../hooks';
import { FieldOptions } from '../../../AutoFormField';

interface InputProps {
  field: protobuf.Field
  name: string
  options?: FieldOptions
  index?: number // if repeated or map field
}

const PrimitiveInput: React.FC<InputProps> = ({
  field, options, name, index,
}) => {
  const { resolvedType, type } = field;
  const { control, watch } = useFormContext();
  const getWellKnownComponent = useGetWellKnownComponent();

  const WellKnownComponent = getWellKnownComponent(field);
  if (WellKnownComponent) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: fieldProps }) => (
          <WellKnownComponent
            watch={watch}
            index={index}
            {...fieldProps}
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
