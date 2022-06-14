import React from 'react';
import protobuf from 'protobufjs';
import { pascalCase } from 'change-case';
import OneofField from './OneofField';
import Input from './Input';
import { useAutoForm } from '../context';
import { FieldOptions } from '../AutoFormField';

interface Props {
  field: protobuf.Field | protobuf.OneOf
  parentName: string
  hideLabel?: boolean
  options?: FieldOptions
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
  label?: string
  field: Props['field']
}> = ({ field, label }) => {
  const { camelCaseLabel, hideFieldType } = useAutoForm();

  return (
    <span className="text-right inline-flex flex-col">
      <span className="leading-tight font-bold">
        {label || (camelCaseLabel ? field.name : toSpaceSeperated(field.name))}
      </span>
      <span className="text-slate-400 text-sm">
        {!hideFieldType && getTypeLabel(field)}
      </span>
    </span>
  );
};

const Field: React.FC<Props> = ({
  field, parentName, hideLabel = false, options,
}) => {
  if (options?.hidden === true) return null;

  return (
    <>
      {!hideLabel && <Label field={field} label={options?.label} />}
      {field instanceof protobuf.OneOf
        ? <OneofField parentName={parentName} oneof={field} />
        : <Input parentName={parentName} field={field} options={options} />}
    </>
  );
};

export default Field;
