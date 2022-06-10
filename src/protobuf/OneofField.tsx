import React from 'react';
import protobuf from 'protobufjs';
import { useFormContext } from 'react-hook-form';
import RadioButton from '../common/RadioButton';
import Input from './Input';

interface OneofProps {
  parentName: string
  oneof: protobuf.OneOf
}

const OneofField: React.FC<OneofProps> = ({ parentName, oneof }) => {
  const { watch } = useFormContext();
  const oneofFullName = parentName ? `${parentName}.${oneof.name}` : oneof.name;
  // TODO: find out why default value does not work
  const selected = watch(oneofFullName) ?? oneof.fieldsArray[0].name;
  const isProto3Optional = oneof.fieldsArray[0].options?.proto3_optional;

  return (
    <div>
      {oneof.fieldsArray.map((f) => (
        <div key={f.name} className="my-2">
          <RadioButton value={f.name} name={oneofFullName} defaultChecked={selected === f.name} />
          {selected === f.name && <Input parentName={parentName} field={f} />}
        </div>
      ))}
      {isProto3Optional && (
      <div className="my-2">
        <RadioButton name={oneofFullName} label="None" />
      </div>
      )}

    </div>
  );
};

export default OneofField;
