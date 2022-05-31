import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import MinusIcon from '../../icon/MinusIcon';
import PlusIcon from '../../icon/PlusIcon';
import Input, { InputProps } from '../Input';
import { fillEmptyFieldsWithDefault, makeTypeOrEnum } from '../utils';

const RepeatedInput: React.FC<InputProps> = (props) => {
  const { control } = useFormContext();
  const { name, resolvedType } = props;
  const { append, remove, fields } = useFieldArray({
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
      <button type="button" className="btn btn-xs btn-outline" onClick={add}>
        <PlusIcon />
        Add
      </button>
      {fields.map((f, idx) => (
        <div key={f.id} className="flex items-center">
          <button type="button" className="btn btn-xs btn-outline btn-error" onClick={() => remove(idx)}>
            <MinusIcon />
          </button>
          <Input {...props} repeated={false} name={`${name}.${idx}.value`} />
        </div>
      ))}
    </fieldset>
  );
};

export default RepeatedInput;
