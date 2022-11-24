import React from 'react';
import protobuf from 'protobufjs';
import { FieldOptions } from '../../models';
import PrimitiveInput from './primitive';
import withOverride from '../../hoc/withOverride';
import withValidationResult from '../../hoc/withValidationResult';
import { RepeatedInput, MapInput } from './complex';

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

export default withValidationResult(withOverride(Input));
