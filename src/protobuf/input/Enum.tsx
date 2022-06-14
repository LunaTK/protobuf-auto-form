import React from 'react';
import protobuf from 'protobufjs';
import { useFormContext } from 'react-hook-form';
import RadioButton from '../../common/RadioButton';
import { FieldOptions } from '../../AutoFormField';

interface Props {
  type: protobuf.Enum
  name: string
  options?: FieldOptions
}

const EnumInput: React.FC<Props> = ({ type, name }) => {
  const { watch } = useFormContext();
  const selected = watch(name) ?? type.valuesById['1'];

  return (
    <div className="flex gap-4 flex-wrap">
      {Object.entries(type.values).map(([label]) => (
        <RadioButton
          label={label}
          value={label}
          name={name}
          key={label}
          defaultChecked={selected === label}
        />
      ))}
    </div>
  );
};

export default EnumInput;
