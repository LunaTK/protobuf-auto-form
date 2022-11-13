import protobuf from 'protobufjs';
import { ConvertValue, createConverter } from './convert';
import type { MapElement, RepeatedElement } from '../../models';

const isRepeated = (
  field: protobuf.Field,
  value: unknown,
): value is RepeatedElement[] => {
  return field.repeated;
};

const isMap = (
  field: protobuf.Field,
  value: unknown,
): value is MapElement[] => {
  return field.map;
};

const encodeValue: ConvertValue = (encode, value, field, options) => {
  if (isRepeated(field, value)) {
    return value.map(({ $value }) =>
      encode($value, field.resolvedType, options),
    );
  }
  if (isMap(field, value)) {
    return Object.fromEntries(
      value.map(({ $key, $value }) => [
        $key,
        encode($value, field.resolvedType, options),
      ]),
    );
  }
  return encode(value, field.resolvedType, options);
};

export const form2Proto = createConverter(encodeValue);

const isUnselectedOneofField = (data: any, field: protobuf.Field) => {
  if (!field.partOf) return false;
  return data[field.partOf.name] !== field.name;
};

export const pruneUnselectedOneofValues = (
  _data: any,
  type: protobuf.Type,
  isRepeated: boolean = false,
) => {
  if (!_data) return _data;
  if (isRepeated) {
    return _data.map((element: any) =>
      pruneUnselectedOneofValues(element, type),
    );
  }

  const data = JSON.parse(JSON.stringify(_data));

  type.fieldsArray.forEach((field) => {
    if (isUnselectedOneofField(data, field)) {
      delete data[field.name];
      return;
    }
    if (field.resolvedType instanceof protobuf.Type) {
      data[field.name] = pruneUnselectedOneofValues(
        data[field.name],
        field.resolvedType,
        field.repeated,
      );
    }
  });

  return data;
};
