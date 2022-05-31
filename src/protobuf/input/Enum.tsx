import React from 'react';
import protobuf from 'protobufjs';
import RadioButton from '../../RadioButton';

interface Props {
  type: protobuf.Enum
  name: string
}

const EnumInput: React.FC<Props> = ({ type, name }) => (
  <fieldset>
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
