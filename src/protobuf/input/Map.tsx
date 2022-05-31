import React from 'react';
import protobuf from 'protobufjs';
import { useFieldArray, useFormContext } from 'react-hook-form';
import MinusIcon from '../../icon/MinusIcon';
import PlusIcon from '../../icon/PlusIcon';
import Input from '../Input';
import { fillEmptyFieldsWithDefault, makeTypeOrEnum } from '../utils';
import BasicInput from './Basic';

interface Props {
  name: string
  field: protobuf.Field
  keyType: string
}

const MapInput: React.FC<Props> = ({ name, field, keyType }) => {
  const { control } = useFormContext();
  const { resolvedType } = field;
  const { append, remove, fields } = useFieldArray({
    control,
    name,
  });

  const add = () => {
    const newValue = makeTypeOrEnum(resolvedType!);
    fillEmptyFieldsWithDefault(newValue, resolvedType!);
    append({
      key: '',
      value: newValue,
    });
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
          <BasicInput type={keyType} name={`${name}.${idx}.key`} />
          <Input name={`${name}.${idx}.value`} field={field} ignoreRepeatAndMap />
        </div>
      ))}
    </fieldset>
  );
};

export default MapInput;
