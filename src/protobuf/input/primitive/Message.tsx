import React, { isValidElement, ReactElement, useMemo } from 'react';
import protobuf from 'protobufjs';
import Field from '../../Field';
import { useChildFields } from '../../../hooks';
import AutoFormField from '../../../AutoFormField';
import { FieldOptions, InputProps } from '../../../models';
import { isAutoFormField } from '../../../childField';

interface Props extends InputProps {
  type: protobuf.Type;
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

    const hasOneAndOnlyField =
      everyOneofFields.size === 0
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

const useRestFields = (
  fields: protobuf.Field[],
  fieldNodes: ReactElement<FieldOptions>[],
) => {
  const fieldNodeSet = new Set(fieldNodes.map(({ props }) => props.name));
  return fields.filter((field) => !fieldNodeSet.has(field.name));
};

const getFieldType = (type: protobuf.Type, name: string) => {
  if (type.fields?.[name]) {
    return type.fields?.[name];
  }
  if (type.oneofs?.[name]) {
    return type.oneofs?.[name];
  }
  return undefined;
};

const Message: React.FC<Props> = ({ type, name = '', options }) => {
  const { nodes, fieldNodes } = useChildFields(options);
  const { fields, oneofs, hasOneAndOnlyField } = useMessage(type);
  const isRoot = name === '';
  const isEmptyMessage = fields.length === 0 && oneofs.length === 0;
  const shouldHideLabel = isRoot && hasOneAndOnlyField;
  const restFields = useRestFields(type.fieldsArray, fieldNodes);

  const content = (
    <>
      {isEmptyMessage && <div className="text-gray-400 text-sm">empty</div>}
      {(nodes.length > 0 ? nodes : [<AutoFormField.Rest />]).map((n) => {
        if (!isValidElement(n)) return n;

        if (isAutoFormField(n)) {
          const fieldOption = n.props;
          const field = getFieldType(type, fieldOption.name);
          if (!field) {
            console.warn('Unknown field', fieldOption.name);
            return null;
          }

          return (
            <Field
              parentName={name}
              field={field}
              key={field.name}
              hideLabel={shouldHideLabel}
              options={fieldOption}
            />
          );
        } else if (n.type === AutoFormField.Rest) {
          return restFields.map((field) => (
            <Field
              parentName={name}
              field={field}
              key={field.name}
              hideLabel={shouldHideLabel}
            />
          ));
        }

        return n;
      })}
    </>
  );

  if (options?.flatten) {
    return <>{content}</>;
  }

  if (shouldHideLabel) {
    return <div className="flex-1">{content}</div>;
  }

  return (
    <div className={`af-msg-grid ${!isRoot ? 'af-repeat-ele' : ''}`}>
      {content}
    </div>
  );
};

export default Message;
