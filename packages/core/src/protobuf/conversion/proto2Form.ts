import protobuf from 'protobufjs';
import { type ConvertValue, createConverter } from './convert';
import type { MapElement, RepeatedElement } from '../../types/autoFormState';

const decodeValue: ConvertValue = (decode, value, field, options) => {
  if (field.repeated) {
    return (value as unknown[]).map(
      (value): RepeatedElement => ({
        $value: decode(value, field.resolvedType, options),
      }),
    );
  } else if (field.map) {
    return Object.entries(value as Record<string, unknown>).map(
      ([$key, $value]): MapElement => ({
        $key,
        $value: decode($value, field.resolvedType, options),
      }),
    );
  } else if (
    field.resolvedType instanceof protobuf.Enum &&
    !Number.isNaN(Number(value))
  ) {
    return field.resolvedType.valuesById[Number(value)];
  }
  return decode(value, field.resolvedType, options);
};

export const proto2Form = createConverter(decodeValue);
