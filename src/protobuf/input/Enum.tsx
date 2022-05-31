import React from 'react';
import protobuf from 'protobufjs';
import RadioButton from '../../RadioButton';

interface Props {
  fieldName: string
  type: protobuf.Enum
}

const EnumInput: React.FC<Props> = ({ type, fieldName }) => (
  <fieldset>
    {Object.entries(type.values).map(([label, value], idx) => (
      <RadioButton
        label={label}
        value={value}
        name={fieldName}
        key={label}
        defaultChecked={idx === 0}
      />
    ))}
  </fieldset>
);

export default EnumInput;
