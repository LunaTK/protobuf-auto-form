import React from 'react';
import protobuf from 'protobufjs';
import { Controller, useFormContext } from 'react-hook-form';
import RepeatedInput from './input/Repeated';
import BasicInput, { isBasicType } from './input/Basic';
import EnumInput from './input/Enum';
import Message from './input/Message';
import MapInput from './input/Map';
import { useAutoForm } from '../context';

interface InputProps {
  field: protobuf.Field
  name: string
  ignoreRepeatAndMap?: boolean
}

const Input: React.FC<InputProps> = ({ field, name, ignoreRepeatAndMap }) => {
  const {
    resolvedType, type, repeated,
  } = field;
  const { typeOverride, fieldOverride } = useAutoForm();
  const { control } = useFormContext();

  if (!ignoreRepeatAndMap && repeated) {
    return <RepeatedInput field={field} name={name} />;
  } if (!ignoreRepeatAndMap && field instanceof protobuf.MapField) {
    return <MapInput name={name} field={field} keyType={field.keyType} />;
  }

  const OverriddenComponent = typeOverride[resolvedType?.fullName ?? ''] ?? fieldOverride[field.name ?? ''];
  if (OverriddenComponent) {
    return (
      <Controller
        name={name}
        control={control}
        render={(props) => <OverriddenComponent field={props.field} />}
      />
    );
  }

  if (isBasicType(type)) {
    return <BasicInput name={name} type={type} />;
  } if (resolvedType instanceof protobuf.Enum) {
    return <EnumInput name={name} type={resolvedType} />;
  } if (resolvedType instanceof protobuf.Type) {
    return <Message name={name} type={resolvedType} />;
  }

  throw new Error(`Unresolved type "${type}" from field "${name}"`);
};

export default Input;
