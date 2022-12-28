import React, { ReactNode } from 'react';
import protobuf from 'protobufjs';
import { useFormContext } from 'react-hook-form';
import RadioButton from '../common/RadioButton';
import Input from './input/Input';
import { FieldOptions } from '../models';
import { useChildFields } from '../hooks';
import { join } from '../utils';

interface OneofProps {
  parentName: string;
  oneof: protobuf.OneOf;
  options?: FieldOptions;
}

const OneofElement: React.FC<{ flatten?: boolean; children: ReactNode }> = ({
  flatten,
  children,
}) => {
  if (flatten) return <>{children}</>;
  return <div className="my-2 not-first-desc:ml-8">{children}</div>;
};

export const isProto3Optional = (oneof: protobuf.OneOf) =>
  oneof.fieldsArray[0].options?.proto3_optional;

const OneofField: React.FC<OneofProps> = ({ parentName, oneof, options }) => {
  const { fieldOptions } = useChildFields(options);
  const { watch, getValues, setValue, register } = useFormContext();
  const oneofFullName = join(parentName, oneof.name);
  if (!getValues(oneofFullName)) {
    setValue(oneofFullName, oneof.fieldsArray[0].name);
  }
  const selected: string = watch(oneofFullName);

  const getDropdownContent = () => {
    const selectedField = oneof.fieldsArray.find((f) => f.name === selected);
    if (!selectedField) return null;

    return (
      <>
        <select
          {...register(oneofFullName)}
          className="select select-bordered select-sm max-w-xs mb-2"
        >
          {oneof.fieldsArray.map((f) => (
            <option key={f.name} value={f.name}>
              {fieldOptions[f.name]?.label ?? f.name}
            </option>
          ))}
          {isProto3Optional(oneof) && <option value="__unset__">None</option>}
        </select>

        <Input
          name={join(parentName, selectedField.name)}
          field={selectedField}
          options={fieldOptions[selectedField.name]}
        />
      </>
    );
  };

  const getRadioContent = () => {
    return (
      <>
        {oneof.fieldsArray.map((f) => (
          <OneofElement key={f.name} flatten={options?.flatten}>
            <RadioButton
              value={f.name}
              name={oneofFullName}
              label={fieldOptions[f.name]?.label}
            />
            {selected === f.name && (
              <Input
                name={join(parentName, f.name)}
                field={f}
                options={fieldOptions[f.name]}
              />
            )}
          </OneofElement>
        ))}
        {isProto3Optional(oneof) && (
          <OneofElement>
            <RadioButton name={oneofFullName} label="None" value="__unset__" />
          </OneofElement>
        )}
      </>
    );
  };

  const content = options?.dropdown ? getDropdownContent() : getRadioContent();

  if (options?.flatten) {
    return content;
  }

  return <div>{content}</div>;
};

export default OneofField;
