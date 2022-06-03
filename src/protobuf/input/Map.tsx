import React from 'react';
import protobuf from 'protobufjs';
import { useFieldArray, useFormContext } from 'react-hook-form';
import get from 'lodash.get';
import AddButton from '../../common/AddButton';
import DelButton from '../../common/DelButton';
import Input from '../Input';
import BasicInput from './Basic';

interface Props {
  name: string
  field: protobuf.Field
  keyType: string
}

const MapValueInput: React.FC<{
  index: number
  name: string
  keyType: string
  field: protobuf.Field
}> = ({
  index, name, keyType, field,
}) => {
  const { getValues } = useFormContext();
  const validate = (value: unknown) => {
    const isDuplicated = (get(getValues(), name) as any[])
      .some(({ key }, i) => i !== index && key === value);
    return !isDuplicated || 'Same key exists';
  };

  return (
    <div className="af-repeat-ele flex-1 flex flex-col my-2 p-2">
      <div className="label">
        <span className="label-text">Key</span>
      </div>
      <BasicInput
        name={`${name}.${index}.key`}
        type={keyType}
        validate={validate}
      />

      <div className="label">
        <span className="label-text">Value</span>
      </div>
      <Input name={`${name}.${index}.value`} field={field} ignoreRepeatAndMap />
    </div>
  );
};

const MapInput: React.FC<Props> = ({ name, field, keyType }) => {
  const { control } = useFormContext();
  const { append, remove, fields } = useFieldArray({
    control,
    name,
  });

  const add = () => {
    append({
      key: '',
      value: {},
    });
  };

  return (
    <div>
      <AddButton onClick={add} />

      {fields.map((f, idx) => (
        <div key={f.id} className="flex items-center gap-2">
          <DelButton onClick={() => remove(idx)} />
          <MapValueInput name={name} field={field} index={idx} keyType={keyType} />
        </div>
      ))}
    </div>
  );
};

export default MapInput;
