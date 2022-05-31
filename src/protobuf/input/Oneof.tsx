import React from 'react';
import protobuf from 'protobufjs';
import { useFormContext } from 'react-hook-form';
import RadioButton from '../../RadioButton';
import Input from '../Input';

interface Props {
  oneof: protobuf.OneOf
}

const OneofInput: React.FC<Props> = ({ oneof }) => {
  const { watch } = useFormContext();
  const selected = watch(oneof.name, oneof.fieldsArray[0].name);

  return (
    <div>
      {oneof.fieldsArray.map((f, idx) => (
        <div key={f.name}>
          <RadioButton value={f.name} name={oneof.name} defaultChecked={idx === 0} />
          {selected === f.name && <Input name={`${f.name}`} repeated={f.repeated} type={f.type} resolvedType={f.resolvedType} />}
        </div>
      ))}
    </div>
  );
};

export default OneofInput;
