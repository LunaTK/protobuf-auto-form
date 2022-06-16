import React from 'react';
import protobuf from 'protobufjs';
import RepeatedInput from './complex/Repeated';
import MapInput from './complex/Map';
import { FieldOptions } from '../../AutoFormField';
import PrimitiveInput from './primitive/PrimitiveInput';

interface InputProps {
  field: protobuf.Field
  parentName: string
  ignoreRepeatAndMap?: boolean
  options?: FieldOptions
}

const Input: React.FC<InputProps> = ({
  field, options, parentName, ignoreRepeatAndMap,
}) => {
  const { repeated } = field;
  const name = parentName ? `${parentName}.${field.name}` : field.name;

  if (!ignoreRepeatAndMap && repeated) {
    return <RepeatedInput field={field} name={name} options={options} />;
  } if (!ignoreRepeatAndMap && field instanceof protobuf.MapField) {
    return <MapInput name={name} field={field} keyType={field.keyType} options={options} />;
  }

  return <PrimitiveInput field={field} name={name} options={options} />;
};

const withPrependAppend = <T extends { options?: FieldOptions }>(
  Component: React.FunctionComponent<T>,
) => (props: T) => {
    const { options } = props;
    return (
      <div>
        {options?.prepend}
        <Component {...props} />
        {options?.append}
      </div>
    );
  };

export default withPrependAppend(Input);
