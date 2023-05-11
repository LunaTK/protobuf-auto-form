import React, { isValidElement, useMemo } from 'react';
import protobuf from 'protobufjs';
import Field from '../../Field';
import {
  isAutoFormField,
  isAutoFormFieldRest,
  useChildFields,
} from '../../../hooks';
import AutoFormField from '../../../AutoFormField';
import { InputProps } from '../../../models';
import { getFieldType, getMessageHints, getRestFields } from './helper';
import { useAutoFormCtx } from '../../../context';

interface Props extends InputProps {
  type: protobuf.Type;
}

const Message: React.FC<Props> = ({ type, name = '', options }) => {
  const { nodes, fieldNodes } = useChildFields(options);
  const { fields, oneofs, hasOneAndOnlyField } = useMemo(
    () => getMessageHints(type),
    [type],
  );
  const isRoot = name === '';
  const isEmptyMessage = fields.length === 0 && oneofs.length === 0;
  const hasOneAndOnlyOneof = oneofs.length === 1 && fields.length === 0;
  const shouldHideLabel = (isRoot && hasOneAndOnlyField) || hasOneAndOnlyOneof;
  const restFields = getRestFields(type.fieldsArray, fieldNodes);
  const { mode, hideEmptyMessage } = useAutoFormCtx();

  const nodesWithRest = (() => {
    if (nodes.length === 0) {
      return [<AutoFormField.Rest />];
    }
    if (mode === 'implicit' && !nodes.some((n) => isAutoFormFieldRest(n))) {
      return [<AutoFormField.Rest />, ...nodes];
    }
    return nodes;
  })();

  const content = (
    <>
      {isEmptyMessage && !hideEmptyMessage && (
        <div className="text-gray-400 text-sm">empty</div>
      )}
      {nodesWithRest.map((n) => {
        if (!isValidElement(n)) return n;

        if (isAutoFormField(n)) {
          const fieldOption = n.props;
          const field = getFieldType(type, fieldOption.name);
          if (field instanceof protobuf.Field && field.partOf) return null; // OneOf will be rendered inside OneofField.tsx
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
