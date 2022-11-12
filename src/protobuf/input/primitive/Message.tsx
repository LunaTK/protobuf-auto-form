import React, { useMemo } from 'react';
import protobuf from 'protobufjs';
import Field from '../../Field';
import { useChildFields } from '../../../hooks';
import AutoFormField from '../../../AutoFormField';
import { useAutoForm } from '../../../context';
import { FieldOptions } from '../../../models';

interface Props {
  type: protobuf.Type
  name?: string
  options?: FieldOptions
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

const Message: React.FC<Props> = ({ type, name = '', options }) => {
  const {
    fieldOptions, nodes, otherNodes, fieldNodes,
  } = useChildFields(options);
  const { fields, oneofs, hasOneAndOnlyField } = useMessage(type);
  const { mode } = useAutoForm();
  const isRoot = name === '';
  const isEmptyMessage = fields.length === 0 && oneofs.length === 0;
  const shouldHideLabel = isRoot && hasOneAndOnlyField;

  const content = (mode === 'autofill' || fieldNodes.length === 0) ? (
    <>
      {isEmptyMessage && <div className="text-gray-400 text-sm">empty</div>}
      {
        [...fields, ...oneofs].map((field) => (
          <Field
            parentName={name}
            field={field}
            key={field.name}
            hideLabel={shouldHideLabel}
            options={fieldOptions[field.name]}
          />
        ))
      }
      {otherNodes}
    </>
  ) : (
    <>
      {nodes.map((n) => {
        if (n.type === AutoFormField) {
          const fieldOption = n.props as FieldOptions;
          const field = type.fields[fieldOption.name] || type.oneofs[fieldOption.name];
          return (
            <Field
              parentName={name}
              field={field}
              key={field.name}
              hideLabel={shouldHideLabel}
              options={fieldOption}
            />
          );
        }

        return n;
      })}
    </>
  );

  if (shouldHideLabel) {
    return <div className="flex-1">{content}</div>;
  }

  return (
    <div className={`grid grid-cols-[fit-content(200px)_1fr] gap-x-4 gap-y-8 p-4 flex-1 ${!isRoot ? 'af-repeat-ele' : ''}`}>
      {content}
    </div>
  );
};

export default Message;
