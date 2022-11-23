import React from 'react';
import protobuf from 'protobufjs';
import { pascalCase } from 'change-case';
import OneofField, { isProto3Optional } from './OneofField';
import Input from './input/Input';
import { useAutoFormCtx } from '../context';
import { FieldOptions } from '../models';
import withPrependAppend from '../hoc/withPrependAppend';
import AutoFormLabel from '../AutoFormLabel';
import { join } from '../utils';

interface Props {
  field: protobuf.Field | protobuf.OneOf;
  parentName: string;
  hideLabel?: boolean;
  options?: FieldOptions;
}

const toSpaceSeperated = (name: string) =>
  pascalCase(name).replace(/([A-Z][a-z])/g, ' $1').replace(/(\d)/g, ' $1');

const getTypeLabel = (field: Props['field']) => {
  if (field instanceof protobuf.OneOf) {
    return isProto3Optional(field) ? 'optional' : 'oneof';
  }
  if (field instanceof protobuf.MapField) {
    return `map<${field.keyType}, ${field.type}>`;
  }
  if (field.repeated) {
    return `repeated<${field.type}>`;
  }
  return field.type;
};

const Field: React.FC<Props> = ({
  field,
  parentName,
  hideLabel = false,
  options,
}) => {
  const { camelCaseLabel, hideFieldType } = useAutoFormCtx();
  if (options?.hidden === true) return null;

  const isFlattenedMessage = 'resolvedType' in field && options?.flatten;
  const ignoreLabel = hideLabel || isFlattenedMessage;

  return (
    <>
      {!ignoreLabel && (
        <AutoFormLabel
          typeLabel={!hideFieldType && getTypeLabel(field)}
          required={!!options?.rules}
        >
          {options?.label ||
            (camelCaseLabel ? field.name : toSpaceSeperated(field.name))}
        </AutoFormLabel>
      )}

      {field instanceof protobuf.OneOf ? (
        <OneofField parentName={parentName} oneof={field} options={options} />
      ) : (
        <Input
          name={join(parentName, field.name)}
          field={field}
          options={options}
        />
      )}
    </>
  );
};

export default withPrependAppend(Field);
