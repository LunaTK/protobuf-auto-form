import protobuf from 'protobufjs';
import { AutoFormContext } from '../context';

const isUnselectedOneofField = (data: any, field: protobuf.Field) => {
  if (!field.partOf) return false;
  return data[field.partOf.name] !== field.name;
};

const pruneUnselectedOneofValues = (_data: any, type: protobuf.Type, isRepeated: boolean = false) => {
  if (!_data) return _data;
  if (isRepeated) {
    return _data.map((element: any) => pruneUnselectedOneofValues(element, type));
  }

  const data = JSON.parse(JSON.stringify(_data));

  type.fieldsArray.forEach((field) => {
    if (isUnselectedOneofField(data, field)) {
      data[field.name] = undefined;
      return;
    }
    if (field.resolvedType instanceof protobuf.Type) {
      data[field.name] = pruneUnselectedOneofValues(data[field.name], field.resolvedType, field.repeated);
    }
  });

  return data;
};

const formToProtoObj = (context: AutoFormContext) => {
  const encode = (formState: unknown, type: protobuf.Type | protobuf.Enum | null) => {
    if (formState === undefined) return undefined;
    if (!(type instanceof protobuf.Type)) return formState;
    const ret = { ...(formState as Record<string, unknown>) };
  
    type.fieldsArray.forEach((f) => {
      if (f.repeated) {
        ret[f.name] = (ret[f.name] as Record<string, unknown>[])?.map(({ $value }) =>
        encode($value, f.resolvedType),
        );
      } else if (f.map) {
        ret[f.name] = Object.fromEntries(
          (ret[f.name] as Record<string, unknown>[])?.map(({ $key, $value }) => [
            $key,
            encode($value, f.resolvedType),
          ]),
        );
      } else if (isUnselectedOneofField(ret, f)) {
        ret[f.name] = undefined;
      } else {
        ret[f.name] = encode(ret[f.name], f.resolvedType);
      }
    });
  
    return ret;
  };
  return encode
}

export const finalize = (formState: unknown, type: protobuf.Type, context: AutoFormContext) => {
  const protoObj = formToProtoObj(context)(formState, type) as Record<string, unknown>;
  const prunedProtoObj = pruneUnselectedOneofValues(protoObj, type);

  return prunedProtoObj;
};

export const protoObjToForm = (protoObj: unknown, type: protobuf.Type | protobuf.Enum | null) => {
  if (!(type instanceof protobuf.Type)) return protoObj;
  const ret = { ...(protoObj as Record<string, unknown>) };

  type.fieldsArray.forEach((f) => {
    if (!ret[f.name]) return;

    if (f.repeated) {
      ret[f.name] = (ret[f.name] as unknown[]).map((value) => ({ $value: protoObjToForm(value, f.resolvedType) }));
    } else if (f.map) {
      ret[f.name] = Object.entries(ret[f.name] as Record<string, unknown>).map(([$key, $value]) => ({
        $key,
        $value: protoObjToForm($value, f.resolvedType),
      }));
    } else {
      ret[f.name] = protoObjToForm(ret[f.name], f.resolvedType);
    }
  });

  return ret;
};
