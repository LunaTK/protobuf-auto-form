import React from 'react';
import protobuf from 'protobufjs';
import { useFormContext } from 'react-hook-form';
import RadioButton from '../common/RadioButton';
import Input from './input/Input';
import { FieldOptions } from '../models';
import { useChildFields } from '../hooks';

interface OneofProps {
  parentName: string;
  oneof: protobuf.OneOf;
  options?: FieldOptions;
}

export const isProto3Optional = (oneof: protobuf.OneOf) =>
  oneof.fieldsArray[0].options?.proto3_optional;

const OneofField: React.FC<OneofProps> = ({ parentName, oneof, options }) => {
  const { fieldOptions } = useChildFields(options);
  const { watch } = useFormContext();
  const oneofFullName = parentName ? `${parentName}.${oneof.name}` : oneof.name;
  // TODO: find out why default value does not work
  const selected = watch(oneofFullName) ?? oneof.fieldsArray[0].name;

  return (
    <div>
      {oneof.fieldsArray.map((f) => (
        <div key={f.name} className="my-2">
          <RadioButton
            value={f.name}
            name={oneofFullName}
            label={fieldOptions[f.name]?.label}
          />
          {selected === f.name && (
            <Input
              parentName={parentName}
              field={f}
              options={fieldOptions[f.name]}
            />
          )}
        </div>
      ))}
      {isProto3Optional(oneof) && (
        <div className="my-2">
          <RadioButton name={oneofFullName} label="None" />
        </div>
      )}
    </div>
  );
};

export default OneofField;
