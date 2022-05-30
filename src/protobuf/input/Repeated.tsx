import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Input, { InputProps } from '../Input';
import { fillEmptyFieldsWithDefault, makeTypeOrEnum } from '../utils';

const RepeatedInput: React.FC<InputProps> = (props) => {
  const { control } = useFormContext();
  const { name, resolvedType } = props;
  const { append, fields } = useFieldArray({
    control,
    name,
  });

  const add = () => {
    const newValue = makeTypeOrEnum(resolvedType!);
    fillEmptyFieldsWithDefault(newValue, resolvedType!);
    append(newValue!);
  };

  return (
    <fieldset>
      <button type="button" onClick={add}>Add</button>
      <legend>
        Array of
        {name}
      </legend>

      {fields.map((f, idx) => <Input key={f.id} {...props} repeated={false} name={`${name}.${idx}.value`} />)}
    </fieldset>
  );
};

export default RepeatedInput;
