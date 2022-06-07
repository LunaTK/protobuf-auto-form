import React from 'react';
import protobuf from 'protobufjs';
import { pascalCase } from 'change-case';
import OneofField from './OneofField';
import Input from './Input';
import { useAutoForm } from '../context';

interface Props {
  field: protobuf.Field | protobuf.OneOf
  parentName: string
  hideLabel?: boolean
}

const toSpaceSeperated = (name: string) => pascalCase(name)
  .replace(/([A-Z][a-z])/g, ' $1')
  .replace(/(\d)/g, ' $1');

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
}> = ({ field }) => {
  const { camelCaseLabel, hideFieldType } = useAutoForm();

  return (
    <span className="text-right inline-flex flex-col">
      <span className="leading-tight font-bold">
        { camelCaseLabel ? field.name : toSpaceSeperated(field.name)}
      </span>
      <span className="text-slate-400 text-sm">
        {!hideFieldType && getTypeLabel(field)}
      </span>
    </span>
  );
};

const Field: React.FC<Props> = ({ field, parentName, hideLabel = false }) => (
  <>
    {!hideLabel && <Label field={field} />}
    {field instanceof protobuf.OneOf
      ? <OneofField parentName={parentName} oneof={field} />
      : <Input name={parentName ? `${parentName}.${field.name}` : field.name} field={field} />}
  </>
);

export default Field;
