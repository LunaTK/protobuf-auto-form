import React from 'react';
import protobuf from 'protobufjs';
import { useFormContext } from 'react-hook-form';
import RadioButton from '../../../common/RadioButton';
import { FieldOptions } from '../../../models';

interface Props {
  type: protobuf.Enum;
  name: string;
  options?: FieldOptions;
}

const getDefaultSelected = (type: protobuf.Enum) => {
  const firstId = Number(Object.keys(type.valuesById)[0]);
  return type.valuesById[firstId];
};

const EnumInput: React.FC<Props> = ({ type, name, options }) => {
  const { watch } = useFormContext();
  const selected = watch(name) ?? getDefaultSelected(type);

  return (
    <div className="flex gap-4 flex-wrap">
      {Object.entries(type.values).map(([label]) => (
        <RadioButton
          label={label}
          value={label}
          name={name}
          key={label}
          disabled={options?.disabled}
        />
      ))}
    </div>
  );
};

export default EnumInput;
