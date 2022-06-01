import protobuf from 'protobufjs';

const isUnselectedOneofField = (data: any, field: protobuf.Field) => {
  if (!field.partOf) return false;
  return data[field.partOf.name] !== field.name;
};

const pruneUnselectedOneofValues = (
  _data: any,
  type: protobuf.Type,
  isRepeated: boolean = false,
) => {
  if (!_data) return _data;
  if (isRepeated) {
    return _data.map((element: any) => pruneUnselectedOneofValues(element, type));
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

const formToProtoObj = (
  formState: unknown,
  type: protobuf.Type | protobuf.Enum | null,
) => {
  if (!(type instanceof protobuf.Type)) return formState;
  const ret = { ...(formState as Record<string, unknown>) };

  type.fieldsArray.forEach((f) => {
    if (f.repeated) {
      ret[f.name] = (ret[f.name] as Record<string, unknown>[])
        .map(({ value }) => formToProtoObj(value, f.resolvedType));
    } else if (f.map) {
      ret[f.name] = Object.fromEntries(
        (ret[f.name] as Record<string, unknown>[])
          .map(({ key, value }) => [key, formToProtoObj(value, f.resolvedType)]),
      );
    } else {
      ret[f.name] = formToProtoObj(ret[f.name], f.resolvedType);
    }
  });

  return ret;
};

// eslint-disable-next-line import/prefer-default-export
export const finalize = (formState: unknown, type: protobuf.Type) => {
  const protoObj = formToProtoObj(formState, type) as Record<string, unknown>;
  const prunedProtoObj = pruneUnselectedOneofValues(protoObj, type);

  return prunedProtoObj;
};
