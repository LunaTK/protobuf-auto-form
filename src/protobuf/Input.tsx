import React from 'react';
import protobuf from 'protobufjs';
import RepeatedInput from './input/Repeated';
import BasicInput, { isBasicType } from './input/Basic';
import EnumInput from './input/Enum';
import Message from './input/Message';

interface InputProps {
  field: protobuf.Field
  name: string
  ignoreRepeatAndMap?: boolean
}

const Input: React.FC<InputProps> = ({ field, name, ignoreRepeatAndMap }) => {
  const {
    resolvedType, type, repeated,
  } = field;

  if (!ignoreRepeatAndMap && repeated) {
    return <RepeatedInput field={field} name={name} />;
  } if (isBasicType(type)) {
    return <BasicInput name={name} type={type} />;
  } if (resolvedType instanceof protobuf.Enum) {
    return <EnumInput name={name} type={resolvedType} />;
  } if (resolvedType instanceof protobuf.Type) {
    return <Message name={name} type={resolvedType} />;
  }

  throw new Error(`Unresolved type "${type}" from field "${name}"`);
};

export default Input;
