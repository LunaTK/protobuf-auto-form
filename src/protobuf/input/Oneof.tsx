import React from 'react';
import protobuf from 'protobufjs';
import { useFormContext } from 'react-hook-form';
import RadioButton from '../../RadioButton';
import Input from '../Input';

interface Props {
  // TODO: full name
  oneof: protobuf.OneOf
}

const OneofInput: React.FC<Props> = ({ oneof }) => {
  const { watch } = useFormContext();
  const selected = watch(oneof.name, oneof.fieldsArray[0].name);

  return (
    <div>
      {oneof.fieldsArray.map((f) => (
        <div key={f.name}>
          <RadioButton value={f.name} name={oneof.name} defaultChecked={selected === oneof.name} />
          {selected === f.name && <Input name={`${f.name}`} field={f} />}
        </div>
      ))}
    </div>
  );
};

export default OneofInput;
