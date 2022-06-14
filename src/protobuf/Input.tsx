import React from 'react';
import protobuf from 'protobufjs';
import { Controller, useFormContext } from 'react-hook-form';
import RepeatedInput from './input/Repeated';
import BasicInput, { isBasicType } from './input/Basic';
import EnumInput from './input/Enum';
import Message from './input/Message';
import MapInput from './input/Map';
import { useGetWellKnownComponent } from '../hooks';
import { FieldOptions } from '../AutoFormField';

interface InputProps {
  field: protobuf.Field
  parentName: string
  ignoreRepeatAndMap?: boolean
  options?: FieldOptions
}

const Input: React.FC<InputProps> = ({
  field, options, parentName, ignoreRepeatAndMap,
}) => {
  const {
    resolvedType, type, repeated,
  } = field;
  const { control } = useFormContext();
  const getWellKnownComponent = useGetWellKnownComponent();
  const name = parentName ? `${parentName}.${field.name}` : field.name;

  if (!ignoreRepeatAndMap && repeated) {
    return <RepeatedInput field={field} name={name} />;
  } if (!ignoreRepeatAndMap && field instanceof protobuf.MapField) {
    return <MapInput name={name} field={field} keyType={field.keyType} />;
  }

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

export default Input;
