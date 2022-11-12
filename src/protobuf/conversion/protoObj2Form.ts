import protobuf from "protobufjs";

export const protoObj2Form = (protoObj: unknown, type: protobuf.Type | protobuf.Enum | null) => {
  if (!(type instanceof protobuf.Type)) return protoObj;
  const ret = { ...(protoObj as Record<string, unknown>) };

  type.fieldsArray.forEach((f) => {
    if (!ret[f.name]) return;

    if (f.repeated) {
      ret[f.name] = (ret[f.name] as unknown[]).map((value) => ({ $value: protoObj2Form(value, f.resolvedType) }));
    } else if (f.map) {
      ret[f.name] = Object.entries(ret[f.name] as Record<string, unknown>).map(([$key, $value]) => ({
        $key,
        $value: protoObj2Form($value, f.resolvedType),
      }));
    } else {
      ret[f.name] = protoObj2Form(ret[f.name], f.resolvedType);
    }
  });

  return ret;
};
