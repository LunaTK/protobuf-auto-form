import React from 'react';
import protobuf from 'protobufjs';
import { useFieldArray, useFormContext } from 'react-hook-form';
import MinusIcon from '../../icon/MinusIcon';
import PlusIcon from '../../icon/PlusIcon';
import Input from '../Input';

interface Props {
  name: string
  field: protobuf.Field
}

const RepeatedInput: React.FC<Props> = ({ field, name }) => {
  const { control } = useFormContext();
  const { append, remove, fields } = useFieldArray({
    control,
    name,
  });

  return (
    <fieldset>
      <button type="button" className="btn btn-xs btn-outline" onClick={() => append({ value: '' })}>
        <PlusIcon />
        Add
      </button>
      {fields.map((f, idx) => (
        <div key={f.id} className="flex items-center gap-2 my-2">
          <button
            type="button"
            className="btn btn-xs btn-outline btn-error"
            onClick={() => {
              remove(idx);
              console.log(idx);
            }}
          >
            <MinusIcon />
          </button>
          <Input name={`${name}.${idx}.value`} field={field} ignoreRepeatAndMap />
        </div>
      ))}
    </fieldset>
  );
};

export default RepeatedInput;
