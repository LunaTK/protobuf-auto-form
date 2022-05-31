import React from 'react';
import protobuf from 'protobufjs';
import OneofInput from './input/Oneof';
import Input from './Input';

interface Props {
  field: protobuf.Field | protobuf.OneOf
  name: string
}

const Label: React.FC<{
  field: Props['field']
}> = ({ field }) => {
  const isOneof = field instanceof protobuf.OneOf;

  return (
    <span className="text-right inline-flex flex-col">
      <span className="leading-3 font-bold">
        {field.name}
      </span>
      <span className="text-slate-500 text-sm">
        (
        {isOneof ? 'oneof' : field.type}
        )
      </span>
    </span>
  );
};

const Field: React.FC<Props> = ({ field, name }) => (
  <>
    <Label field={field} />
    {field instanceof protobuf.OneOf
      ? <OneofInput oneof={field} />
      : (
        <Input
          name={`${name}.${field.name}`}
          repeated={field.repeated}
          resolvedType={field.resolvedType}
          type={field.type}
        />
      )}
  </>
);

export default Field;
