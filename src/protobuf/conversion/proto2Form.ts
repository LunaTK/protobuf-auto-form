import protobuf from "protobufjs";
import { type ConvertValue, createConverter } from "./convert";
import type { MapElement, RepeatedElement } from "../../models";

const decodeValue: ConvertValue = (decode, value, field, options) => {
  if (field.repeated) {
    return (value as unknown[]).map(
      (value): RepeatedElement => ({
        $value: decode(value, field.resolvedType, options),
      })
    );
  } else if (field.map) {
    return Object.entries(value as Record<string, unknown>).map(
      ([$key, $value]): MapElement => ({
        $key,
        $value: decode($value, field.resolvedType, options),
      })
    );
  }
  return decode(value, field.resolvedType, options);
};

export const proto2Form = createConverter(decodeValue);

const makeTypeOrEnum = (typeOrEnum: protobuf.Type | protobuf.Enum) => {
  if (typeOrEnum instanceof protobuf.Type) {
    const created = typeOrEnum.toObject(typeOrEnum.create({}), {
      defaults: true,
      arrays: true,
      objects: true,
      oneofs: false, // 왜 이게 안먹히지??
      longs: Number,
    });
    // TODO(@LunaTK): oneofs 옵션 동작하면 제거하기
    typeOrEnum.oneofsArray.forEach((oneof) => {
      created[oneof.name] = oneof.fieldsArray[0].name;
    });
    return created;
  } else if (typeOrEnum instanceof protobuf.Enum) {
    return 0;
  }
  return null;
};

export const fillDefaults = (
  data: any,
  type: protobuf.Type | protobuf.Enum | null
) => {
  if (type === null) {
    return data;
  } else if (type instanceof protobuf.Enum) {
    return data ?? 0;
  }

  type.fieldsArray.forEach((field) => {
    if (data[field.name] === null || data[field.name] === undefined) {
      data[field.name] = field.defaultValue || field.typeDefault;
    }

    if (data[field.name] === null || data[field.name] === undefined) {
      data[field.name] = fillDefaults(
        makeTypeOrEnum(type.fields[field.name].resolvedType!),
        type.fields[field.name].resolvedType!
      );
    } else if (typeof data[field.name] === "object") {
      fillDefaults(data[field.name], type.fields[field.name].resolvedType!);
    }
  });

  type.oneofsArray.forEach((oneof) => {
    if (data[oneof.name]) return;
    data[oneof.name] = oneof.fieldsArray[0].name;
  });

  return data;
};
