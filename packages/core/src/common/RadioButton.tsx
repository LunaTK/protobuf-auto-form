import React from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
  value?: string;
  name: string;
  label?: string;
  defaultChecked?: boolean;
  readOnly?: boolean;
}

const RadioButton: React.FC<Props> = ({
  value,
  name,
  label = value,
  readOnly,
}) => {
  const { register } = useFormContext();
  const id = `${name}.${value}`;

  return (
    <label
      htmlFor={id}
      className="cursor-pointer inline-flex items-center justify-start space-x-2"
    >
      <input
        type="radio"
        className="radio-xs"
        id={id}
        value={value}
        readOnly={readOnly}
        {...register(name)}
      />
      <span className="label-text">{label}</span>
    </label>
  );
};

export default RadioButton;
