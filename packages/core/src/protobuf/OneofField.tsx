import React, { ReactNode } from 'react';
import protobuf from 'protobufjs';
import { useFormContext } from 'react-hook-form';
import RadioButton from '../common/RadioButton';
import Input from './input/Input';
import { FieldOptions } from '../models';
import { useChildFields } from '../hooks';
import { join, toSpaceSeperated } from '../utils';
import { useAutoFormCtx } from '../context';

interface OneofProps {
  parentName: string;
  oneof: protobuf.OneOf;
  options?: FieldOptions;
}

const OPT_UNSET = '__unset__';

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
  const { camelCaseLabel } = useAutoFormCtx();
  const { watch, getValues, setValue, register } = useFormContext();
  const oneofFullName = join(parentName, oneof.name);
  if (!getValues(oneofFullName)) {
    setValue(oneofFullName, OPT_UNSET);
  }
  const selected: string = watch(oneofFullName);
  const renderLabel = (f: protobuf.Field) =>
    fieldOptions[f.name]?.label ??
    (camelCaseLabel ? f.name : toSpaceSeperated(f.name));

  const getDropdownContent = () => {
    const selectedField = oneof.fieldsArray.find((f) => f.name === selected);
    if (!selectedField) return null;

    return (
      <>
        <select
          {...register(oneofFullName)}
          className="max-w-xs mb-2 select select-bordered select-sm"
        >
          {oneof.fieldsArray.map((f) => (
            <option key={f.name} value={f.name}>
              {renderLabel(f)}
            </option>
          ))}
          {isProto3Optional(oneof) && <option value={OPT_UNSET}>None</option>}
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
              label={renderLabel(f)}
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
            <RadioButton name={oneofFullName} label="None" value={OPT_UNSET} />
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
