import React from 'react';
import protobuf from 'protobufjs';
import OneofInput from './input/Oneof';
import Input from './Input';

interface Props {
  field: protobuf.Field | protobuf.OneOf
  parentName: string
}

const getTypeLabel = (field: Props['field']) => {
  if (field instanceof protobuf.OneOf) {
    return 'oneof';
  } if (field instanceof protobuf.MapField) {
    return `map<${field.keyType}, ${field.type}>`;
  }
  return field.type;
};

const Label: React.FC<{
  field: Props['field']
}> = ({ field }) => (
  <span className="text-right inline-flex flex-col">
    <span className="leading-tight font-bold">
      {field.name}
    </span>
    <span className="text-slate-400 text-sm">
      {getTypeLabel(field)}
    </span>
  </span>
);

const Field: React.FC<Props> = ({ field, parentName }) => (
  <>
    <Label field={field} />
    {field instanceof protobuf.OneOf
      ? <OneofInput parentName={parentName} oneof={field} />
      : <Input name={parentName ? `${parentName}.${field.name}` : field.name} field={field} />}
  </>
);

export default Field;
