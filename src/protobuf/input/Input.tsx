import React from 'react';
import protobuf from 'protobufjs';
import RepeatedInput from './complex/Repeated';
import MapInput from './complex/Map';
import { FieldOptions } from '../../models';
import PrimitiveInput from './primitive/PrimitiveInput';
import withOverride from '../../hoc/withOverride';

interface InputProps {
  field: protobuf.Field;
  name: string;
  ignoreRepeatAndMap?: boolean;
  options?: FieldOptions;
}

const Input: React.FC<InputProps> = ({
  field,
  options,
  name,
  ignoreRepeatAndMap,
}) => {
  const { repeated } = field;

  if (!ignoreRepeatAndMap && repeated) {
    return <RepeatedInput field={field} name={name} options={options} />;
  }
  if (!ignoreRepeatAndMap && field instanceof protobuf.MapField) {
    return (
      <MapInput
        name={name}
        field={field}
        keyType={field.keyType}
        options={options}
      />
    );
  }

  return <PrimitiveInput field={field} name={name} options={options} />;
};

export default withOverride(Input);
