import React from 'react';
import protobuf from 'protobufjs';
import RadioButton from '../../common/RadioButton';

interface Props {
  type: protobuf.Enum
  name: string
}

const EnumInput: React.FC<Props> = ({ type, name }) => (
  <fieldset className="flex gap-4 flex-wrap">
    {Object.entries(type.values).map(([label, value], idx) => (
      <RadioButton
        label={label}
        value={String(value)}
        name={name}
        key={label}
        defaultChecked={idx === 0}
      />
    ))}
  </fieldset>
);

export default EnumInput;
