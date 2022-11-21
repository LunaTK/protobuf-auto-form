import protobuf from 'protobufjs';
import { ReactElement } from 'react';
import { FieldOptions } from '../../../models';

export const getMessageHints = (type: protobuf.Type) => {
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
};

export const getRestFields = (
  fields: protobuf.Field[],
  fieldNodes: ReactElement<FieldOptions>[],
) => {
  const fieldNodeSet = new Set(
    fieldNodes.map(({ props }) => props.name as string),
  );
  const handledOneOf = new Set<protobuf.OneOf>();
  const fieldsAndOneofs = fields
    .map((field) => field.partOf || field)
    .reduce((acc, val) => {
      if (val instanceof protobuf.Field) return [...acc, val];
      if (handledOneOf.has(val)) return acc;
      handledOneOf.add(val);
      return [...acc, val];
    }, [] as (protobuf.Field | protobuf.OneOf)[]);
  return fieldsAndOneofs.filter((field) => !fieldNodeSet.has(field.name));
};

export const getFieldType = (type: protobuf.Type, name: string) => {
  if (type.fields?.[name]) {
    return type.fields?.[name];
  }
  if (type.oneofs?.[name]) {
    return type.oneofs?.[name];
  }
  return undefined;
};
