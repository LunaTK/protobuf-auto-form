import React, { useMemo } from 'react';
import protobuf from 'protobufjs';
import Field from './Field';

interface Props {
  type: protobuf.Type
}

const useMessage = (type: protobuf.Type) => {
  const info = useMemo(() => {
    const everyOneofFields = new Set(
      Object.values(type.oneofs ?? []).flatMap((o) => o.oneof),
    );

    const fields = type.fieldsArray.filter(
      (field) => !everyOneofFields.has(field.name),
    );

    const oneofs = type.oneofs === undefined ? [] : Object.keys(type.oneofs);

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

const Message: React.FC<Props> = ({ type }) => {
  const { fields } = useMessage(type);

  return (
    <div>
      {fields.map((field) => <Field field={field} key={field.name} />)}
    </div>
  );
};

export default Message;
