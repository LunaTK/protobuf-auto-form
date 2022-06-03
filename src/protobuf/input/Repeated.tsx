import React from 'react';
import protobuf from 'protobufjs';
import { useFieldArray, useFormContext } from 'react-hook-form';
import DelButton from '../../common/DelButton';
import AddButton from '../../common/AddButton';
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
      <AddButton onClick={() => append({ value: '' })} />
      {fields.map((f, idx) => (
        <div key={f.id} className="flex items-center gap-2 my-2">
          <DelButton onClick={() => { remove(idx); }} />
          <Input name={`${name}.${idx}.value`} field={field} ignoreRepeatAndMap />
        </div>
      ))}
    </fieldset>
  );
};

export default RepeatedInput;
