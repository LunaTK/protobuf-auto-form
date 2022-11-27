import React from 'react';
import protobuf from 'protobufjs';
import { useFieldArray, useFormContext } from 'react-hook-form';
import get from 'lodash.get';
import PrimitiveInput from '../primitive';
import BasicInput from '../primitive/Basic';
import { FieldOptions } from '../../../models';
import { useChildFields } from '../../../hooks';
import { getInitialValue } from '../../conversion/initial';
import ArrayLike from './ArrayLike';

interface MapProps {
  name: string;
  field: protobuf.Field;
  keyType: string;
  options?: FieldOptions;
}

const MapKeyValueInput: React.FC<{
  index: number;
  name: string;
  keyType: string;
  field: protobuf.Field;
  keyOptions?: FieldOptions;
  valueOptions?: FieldOptions;
}> = ({ index, name, keyType, field, keyOptions, valueOptions }) => {
  const { getValues } = useFormContext();
  const validate = (value: unknown) => {
    const isDuplicated = (get(getValues(), name) as any[]).some(
      ({ $key }, i) => i !== index && $key === value,
    );
    return !isDuplicated || 'Same key exists';
  };
  const keyLabel = keyOptions?.label ?? 'Key';
  const valueLabel = valueOptions?.label ?? 'Value';

  return (
    <div className="af-repeat-ele flex-1 flex flex-col my-2 p-2">
      <div className="label">
        <span className="label-text">{keyLabel}</span>
      </div>
      <BasicInput
        name={`${name}.${index}.$key`}
        type={keyType}
        validate={validate}
        options={keyOptions}
      />

      <div className="label">
        <span className="label-text">{valueLabel}</span>
      </div>
      <PrimitiveInput
        name={`${name}.${index}.$value`}
        field={field}
        options={valueOptions}
        index={index}
      />
    </div>
  );
};

const MapInput: React.FC<MapProps> = ({ name, field, keyType, options }) => {
  const { control } = useFormContext();
  const { append, remove, fields } = useFieldArray({
    control,
    name,
    rules: options?.rules,
  });

  const add = () => {
    append({
      $key: '',
      $value: getInitialValue(field),
    });
  };

  const { $key: keyOptions, $value: valueOptions } =
    useChildFields(options).fieldOptions;

  return (
    <ArrayLike
      onAdd={add}
      onRemove={remove}
      fields={fields}
      render={({ idx }) => (
        <MapKeyValueInput
          name={name}
          field={field}
          index={idx}
          keyType={keyType}
          keyOptions={keyOptions}
          valueOptions={valueOptions}
        />
      )}
    />
  );
};

export default MapInput;