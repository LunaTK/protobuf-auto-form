import React from 'react';
import protobuf from 'protobufjs';
import { Controller, useFormContext } from 'react-hook-form';
import BasicInput, { isBasicType } from './Basic';
import EnumInput from './Enum';
import Message from './Message';
import { useGetWellKnownComponent } from '../../../hooks/useWellKnownComponent';
import { InputProps } from '../../../models';

interface PrimitiveInputProps extends InputProps {
  field: protobuf.Field;
  index?: number; // if repeated or map field
}

const PrimitiveInput: React.FC<PrimitiveInputProps> = ({
  field,
  options,
  name,
  index,
}) => {
  const { resolvedType, type } = field;
  const { control, watch } = useFormContext();
  const getWellKnownComponent = useGetWellKnownComponent();

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

  const WellKnownComponent = getWellKnownComponent(field);
  if (WellKnownComponent) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: fieldProps }) => (
          <WellKnownComponent watch={watch} index={index} {...fieldProps} />
        )}
        rules={rules}
      />
    );
  }

  if (isBasicType(type)) {
    return <BasicInput name={name} type={type} options={options} />;
  }
  if (resolvedType instanceof protobuf.Enum) {
    return <EnumInput name={name} type={resolvedType} options={options} />;
  }
  if (resolvedType instanceof protobuf.Type) {
    return <Message name={name} type={resolvedType} options={options} />;
  }

  throw new Error(`Unresolved type "${type}" from field "${name}"`);
};

export default PrimitiveInput;
