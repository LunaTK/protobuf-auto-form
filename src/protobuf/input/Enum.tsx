import React from 'react';
import protobuf from 'protobufjs';
import { useFormContext } from 'react-hook-form';
import RadioButton from '../../common/RadioButton';

interface Props {
  type: protobuf.Enum
  name: string
}

const EnumInput: React.FC<Props> = ({ type, name }) => {
  const { watch } = useFormContext();
  const selected = watch(name) ?? '1';

  return (
    <fieldset className="flex gap-4 flex-wrap">
      {Object.entries(type.values).map(([label, value]) => (
        <RadioButton
          label={label}
          value={String(value)}
          name={name}
          key={label}
          defaultChecked={selected === value}
        />
      ))}
    </fieldset>
  );
};

export default EnumInput;
