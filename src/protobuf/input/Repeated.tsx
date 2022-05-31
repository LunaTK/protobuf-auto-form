import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add
      </button>
      {fields.map((f, idx) => (
        <div key={f.id} className="flex items-center">
          <button type="button" className="btn btn-xs btn-outline btn-error" onClick={() => remove(idx)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
            </svg>
          </button>
          <Input {...props} repeated={false} name={`${name}.${idx}.value`} />
        </div>
      ))}
    </fieldset>
  );
};

export default RepeatedInput;
