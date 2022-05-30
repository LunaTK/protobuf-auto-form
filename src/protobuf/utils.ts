import protobuf from 'protobufjs';

export const makeTypeOrEnum = (typeOrEnum: protobuf.Type | protobuf.Enum) => {
  if (typeOrEnum instanceof protobuf.Type) {
    const created = typeOrEnum.toObject(typeOrEnum.create({}), {
      defaults: true,
      arrays: true,
      objects: true,
      oneofs: false, // TODO: make it work
      longs: Number,
    });
    // TODO: remove when oneofs option work.
    typeOrEnum.oneofsArray.forEach((oneof) => {
      created[oneof.name] = oneof.fieldsArray[0].name;
    });
    return created;
  } if (typeOrEnum instanceof protobuf.Enum) {
    return 0;
  }
  return null;
};

export const fillEmptyFieldsWithDefault = (
  data: any,
  type: protobuf.Type | protobuf.Enum | null,
) => {
  if (type === null) {
    return data;
  } if (type instanceof protobuf.Enum) {
    return data ?? 0;
  }

  type.fieldsArray.forEach((field) => {
    if (field.map || field.repeated) return;

    if (data[field.name] === null || data[field.name] === undefined) {
      data[field.name] = field.defaultValue || field.typeDefault;
    }

    if (data[field.name] === null || data[field.name] === undefined) {
      data[field.name] = fillEmptyFieldsWithDefault(
        makeTypeOrEnum(type.fields[field.name].resolvedType!),
        type.fields[field.name].resolvedType!,
      );
    } else if (typeof data[field.name] === 'object') {
      fillEmptyFieldsWithDefault(
        data[field.name],
        type.fields[field.name].resolvedType!,
      );
    }
  });

  return data;
};

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
