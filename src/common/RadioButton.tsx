import React from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
  value: string
  name: string
  label?: string
  defaultChecked?: boolean
}

const RadioButton: React.FC<Props> = ({
  value, name, label = value, defaultChecked = false,
}) => {
  const { register } = useFormContext();

  return (
    <label htmlFor={label} className="cursor-pointer inline-flex items-center justify-start space-x-2">
      <input type="radio" className="radio-xs" id={label} value={value} defaultChecked={defaultChecked} {...register(name)} />
      <span className="label-text">
        {label}
      </span>
    </label>
  );
};

export default RadioButton;
