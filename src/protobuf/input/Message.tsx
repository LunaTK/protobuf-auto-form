import React, { useMemo } from 'react';
import protobuf from 'protobufjs';
import Field from '../Field';
import OneofInput from './Oneof';
import Input from '../Input';

interface Props {
  type: protobuf.Type
  name?: string
}

const useMessage = (type: protobuf.Type) => {
  const info = useMemo(() => {
    const everyOneofFields = new Set(
      Object.values(type.oneofs ?? []).flatMap((o) => o.oneof),
    );

    const fields = type.fieldsArray.filter(
      (field) => !everyOneofFields.has(field.name),
    );

    const oneofs = type.oneofs === undefined ? [] : Object.values(type.oneofs);

    const hasOneAndOnlyField = everyOneofFields.size === 0
      ? fields.length === 1
      : fields.length === 0 && oneofs.length === 1;

    return {
      hasOneAndOnlyField,
      fields,
      oneofs,
    };
  }, [type]);

  return info;
};

const Message: React.FC<Props> = ({ type, name = '' }) => {
  const { fields, oneofs } = useMessage(type);

  return (
    <div className="grid grid-cols-2 gap-4">
      {fields.map((field) => (
        <Field
          name={`${name}.${field.name}`}
          type={field.type}
          key={field.name}
        >
          <Input
            name={`${name}.${field.name}`}
            repeated={field.repeated}
            resolvedType={field.resolvedType}
            type={field.type}
          />
        </Field>
      ))}
      {oneofs.map((oneof) => (
        <OneofInput
          key={oneof.name}
          oneof={oneof}
        />
      ))}
    </div>
  );
};

export default Message;
