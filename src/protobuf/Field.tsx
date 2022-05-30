import React from 'react';
import protobuf from 'protobufjs';
import BasicField, { isBasicType } from './field/Basic';
import EnumField from './field/Enum';

interface Props {
  field: protobuf.Field;
}

const Field: React.FC<Props> = ({ field }) => {
  if (isBasicType(field.type)) {
    return <BasicField field={field} />;
  } if (field.resolvedType instanceof protobuf.Enum) {
    return <EnumField fieldName={field.name} type={field.resolvedType} />;
  }

  return <>WIP</>;
};

export default Field;
