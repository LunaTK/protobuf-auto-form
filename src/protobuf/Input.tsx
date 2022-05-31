import React from 'react';
import protobuf from 'protobufjs';
import RepeatedInput from './input/Repeated';
import BasicInput, { isBasicType } from './input/Basic';
import EnumInput from './input/Enum';
import Message from './input/Message';

export interface InputProps {
  type: protobuf.Field['type']
  resolvedType: protobuf.Field['resolvedType']
  name: protobuf.Field['name']
  repeated: protobuf.Field['repeated']
}

const Input: React.FC<InputProps> = (props) => {
  const {
    name, resolvedType, type, repeated,
  } = props;

  if (repeated) {
    return <RepeatedInput {...props} />;
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
