import React from 'react';
import protobuf from 'protobufjs';
import { useFormContext } from 'react-hook-form';
import RadioButton from '../../../common/RadioButton';
import { InputProps } from '../../../models';
import { getInitialEnumValue } from '../../conversion/initial';

interface Props extends InputProps {
  type: protobuf.Enum;
}

const EnumInput: React.FC<Props> = ({ type, name, options }) => {
  const { getValues, setValue } = useFormContext();
  if (!getValues(name)) {
    setValue(name, getInitialEnumValue(type));
  }

  return (
    <div className="flex gap-4 flex-wrap">
      {Object.entries(type.values).map(([label]) => (
        <RadioButton
          label={label}
          value={label}
          name={name}
          key={label}
          readOnly={options?.readOnly}
        />
      ))}
    </div>
  );
};

export default EnumInput;
