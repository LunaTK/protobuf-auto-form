import React from 'react';
import protobuf from 'protobufjs';
import { useFieldArray, useFormContext } from 'react-hook-form';
import get from 'lodash.get';
import MinusIcon from '../../icon/MinusIcon';
import PlusIcon from '../../icon/PlusIcon';
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
    <fieldset>
      <button type="button" className="btn btn-xs btn-outline" onClick={add}>
        <PlusIcon />
        Add
      </button>
      {fields.map((f, idx) => (
        <div key={f.id} className="flex items-center gap-2">
          <button type="button" className="btn btn-xs btn-outline btn-error" onClick={() => remove(idx)}>
            <MinusIcon />
          </button>

          <MapValueInput name={name} field={field} index={idx} keyType={keyType} />
        </div>
      ))}
    </fieldset>
  );
};

export default MapInput;
