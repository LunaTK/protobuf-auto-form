import React from 'react';
import protobuf from 'protobufjs';
import { useFormContext } from 'react-hook-form';

interface Props {
  fieldName: string
  type: protobuf.Enum
}

const EnumInput: React.FC<Props> = ({ type, fieldName }) => {
  const { register } = useFormContext();

  return (
    <fieldset>
      {Object.entries(type.values).map(([label, value], idx) => (
        <label
          htmlFor={label}
          key={label}
        >
          <input
            type="radio"
            id={label}
            value={value}
            {...register(fieldName)}
            defaultChecked={idx === 0}
          />
          {label}
        </label>
      ))}
    </fieldset>
  );
};

export default EnumInput;
