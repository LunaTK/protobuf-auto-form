import protobuf from "protobufjs";
import { ConvertValue, createConverter } from "./convert";
import type { MapElement, RepeatedElement } from "../../models";

const isRepeated = (
  field: protobuf.Field,
  value: unknown
): value is RepeatedElement[] => {
  return field.repeated;
};

const isMap = (
  field: protobuf.Field,
  value: unknown
): value is MapElement[] => {
  return field.map;
};

const encodeValue: ConvertValue = (encode, value, field, options) => {
  if (isRepeated(field, value)) {
    return value.map(({ $value }) =>
      encode($value, field.resolvedType, options)
    );
  }
  if (isMap(field, value)) {
    return Object.fromEntries(
      value.map(({ $key, $value }) => [
        $key,
        encode($value, field.resolvedType, options),
      ])
    );
  }
  return encode(value, field.resolvedType, options);
};

export const form2ProtoObj = createConverter(encodeValue);
