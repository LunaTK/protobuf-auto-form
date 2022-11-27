import React from 'react';
import protobuf from 'protobufjs';
import { useFieldArray, useFormContext } from 'react-hook-form';
import PrimitiveInput from '../primitive';
import { FieldOptions } from '../../../models';
import { useChildFields } from '../../../hooks';
import { getInitialValue } from '../../conversion/initial';
import ArrayLike from './ArrayLike';

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
    rules: options?.rules,
  });

  return (
    <ArrayLike
      onAdd={() => append({ $value: getInitialValue(field) })}
      onRemove={remove}
      fields={fields}
      render={({ idx }) => (
        <PrimitiveInput
          name={`${name}.${idx}.$value`}
          field={field}
          options={valueOptions}
          index={idx}
        />
      )}
    />
  );
};

export default RepeatedInput;
