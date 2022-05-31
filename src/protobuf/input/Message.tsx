import React, { useMemo } from 'react';
import protobuf from 'protobufjs';
import Field from '../Field';

interface Props {
  type: protobuf.Type
  name?: string
}

const useMessage = (type: protobuf.Type) => {
  const info = useMemo(() => {
    const everyOneofFields = new Set(
      Object.values(type.oneofs ?? {}).flatMap((o) => o.oneof),
    );

    const fields = type.fieldsArray.filter(
      (field) => !everyOneofFields.has(field.name),
    );

    const oneofs = Object.values(type.oneofs ?? {});

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
  const isRoot = name === '';

  return (
    <div className={`grid grid-cols-[fit-content(200px)_1fr] gap-x-4 gap-y-8 p-4 flex-1 ${!isRoot ? 'af-repeat-ele' : ''}`}>
      {
        [...fields, ...oneofs].map((field) => (
          <Field
            name={`${name ? `${name}.` : ''}${field.name}`}
            field={field}
            key={field.name}
          />
        ))
      }
    </div>
  );
};

export default Message;
