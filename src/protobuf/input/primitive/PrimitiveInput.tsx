import React from 'react';
import protobuf from 'protobufjs';
import BasicInput, { isBasicType } from './Basic';
import EnumInput from './Enum';
import Message from './Message';
import { InputProps } from '../../../models';
import withOverride from '../../../hoc/withOverride';

interface PrimitiveInputProps extends InputProps {
  field: protobuf.Field;
  index?: number; // if repeated or map field
}

const PrimitiveInput: React.FC<PrimitiveInputProps> = ({
  field,
  options,
  name,
}) => {
  const { resolvedType, type } = field;

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

export default withOverride(PrimitiveInput);
