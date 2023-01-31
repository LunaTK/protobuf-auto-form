import protobuf from 'protobufjs';
import { isProto3Optional } from '../OneofField';

type InitialValueOptions = {
  ignoreArrayLike: boolean;
};
export const getInitialValue = (
  field: protobuf.Field,
  options?: InitialValueOptions,
) => {
  const ignoreArrayLike = options?.ignoreArrayLike ?? false;
  if (!ignoreArrayLike) {
    if (field.map) return {};
    if (field.repeated) return [];
  }
  if (field.resolvedType instanceof protobuf.Type) {
    return getInitialMessageValue(field.resolvedType);
  }
  if (field.resolvedType instanceof protobuf.Enum) {
    return getInitialEnumValue(field.resolvedType);
  }
  if (!isUnset(field.defaultValue)) {
    return field.defaultValue;
  }
  if (!isUnset(field.typeDefault)) {
    return field.typeDefault;
  }
  throw new Error('Unknown type: ' + field);
};

export const fillInitialValues = (
  data: any,
  type: protobuf.Type | protobuf.Enum | null,
) => {
  if (!(type instanceof protobuf.Type)) {
    return data;
  }

  type.fieldsArray.forEach((field) => {
    if (field.partOf && isProto3Optional(field.partOf)) {
      return;
    }

    if (isUnset(data[field.name])) {
      data[field.name] = getInitialValue(field);
      return;
    }

    if (field.repeated) {
      data[field.name].forEach((value: any) =>
        fillInitialValues(value, field.resolvedType),
      );
    } else if (field.map) {
      Object.keys(data[field.name]).forEach((value: any) =>
        fillInitialValues(value, field.resolvedType),
      );
    } else if (field.resolvedType instanceof protobuf.Type) {
      fillInitialValues(data[field.name], field.resolvedType);
    }
  });

  type.oneofsArray.forEach((oneof) => {
    if (data[oneof.name]) return;
    data[oneof.name] = oneof.fieldsArray[0].name;
  });

  return data;
};

// https://github.com/fullstorydev/grpcui/blob/4ddf8a02af25e2459bac9531d88ec9cb93f5414b/internal/resources/webform/webform.js#L1986
function getInitialMessageValue(type: protobuf.Type) {
  switch (type.fullName) {
    case 'google.protobuf.Timestamp':
      return '1970-01-01T00:00:00Z';
    case 'google.protobuf.Duration':
      return '0s';
    case 'google.protobuf.Int32Value':
    case 'google.protobuf.UInt32Value':
    case 'google.protobuf.DoubleValue':
    case 'google.protobuf.FloatValue':
      return 0;
    case 'google.protobuf.Int64Value':
    case 'google.protobuf.UInt64Value':
      return '0';
    case 'google.protobuf.StringValue':
    case 'google.protobuf.BytesValue':
      return '';
    case 'google.protobuf.BoolValue':
      return false;
    case 'google.protobuf.Value':
      return {};
    case 'google.protobuf.ListValue':
      return [];
    default:
      const created = type.toObject(type.create({}), {
        defaults: true,
        arrays: true,
        objects: true,
        oneofs: false, // don't know why it's not working...
        longs: Number,
      });
      fillInitialValues(created, type);
      // TODO(@LunaTK): remove if oneofs option from protobufjs works.
      type.oneofsArray.forEach((oneof) => {
        created[oneof.name] = oneof.fieldsArray[0].name;
      });
      return created;
  }
}

export function getInitialEnumValue(enumType: protobuf.Enum) {
  return Object.entries(enumType.valuesById)[0][1];
}

function isUnset(value: unknown) {
  return value === null || typeof value === 'undefined';
}
