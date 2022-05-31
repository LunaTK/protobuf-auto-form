import React from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
  label: string
  value: string | number
  name: string
  defaultChecked?: boolean
}

const RadioButton: React.FC<Props> = ({
  value, label, name, defaultChecked = false,
}) => {
  const { register } = useFormContext();

  return (
    <label htmlFor={label} className="cursor-pointer">
      <input type="radio" className="radio-xs" id={label} value={value} defaultChecked={defaultChecked} {...register(name)} />
      <span className="label-text">
        {label}
      </span>
    </label>
  );
};

export default RadioButton;
