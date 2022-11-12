import React from 'react';
import protobuf from 'protobufjs';
import { useFieldArray, useFormContext } from 'react-hook-form';
import DelButton from '../../../common/DelButton';
import AddButton from '../../../common/AddButton';
import PrimitiveInput from '../primitive/PrimitiveInput';
import { FieldOptions } from '../../../models';
import { useChildFields } from '../../../hooks';

interface Props {
  name: string;
  field: protobuf.Field;
  options?: FieldOptions;
}

const RepeatedInput: React.FC<Props> = ({ field, name, options }) => {
  const { $value: valueOptions } = useChildFields(options).fieldOptions;
  const { control } = useFormContext();
  const { append, remove, fields } = useFieldArray({
    control,
    name,
  });

  return (
    <div>
      <AddButton onClick={() => append({ $value: '' })} />
      {fields.map((f, idx) => (
        <div key={f.id} className="flex items-center gap-2 my-2">
          <DelButton
            onClick={() => {
              remove(idx);
            }}
          />
          <PrimitiveInput name={`${name}.${idx}.$value`} field={field} options={valueOptions} index={idx} />
        </div>
      ))}
    </div>
  );
};

export default RepeatedInput;
