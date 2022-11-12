import protobuf from "protobufjs";
import { getWellKnownComponent, parseChildOptions } from "../../childField";
import { AutoFormContext } from "../../context";
import { FieldOptions } from "../../models";

export const protoObj2Form = (context: AutoFormContext) => {
  const decode = (protoObj: unknown, type: protobuf.Type | protobuf.Enum | null, fieldOptions: FieldOptions | undefined) => {
    if (!(type instanceof protobuf.Type)) return protoObj;
    const ret = { ...(protoObj as Record<string, unknown>) };
    const { fieldOptions: childFieldOptions } = parseChildOptions(fieldOptions)
  
    type.fieldsArray.forEach((f) => {
      if (!ret[f.name]) return;

      const options = childFieldOptions[f.name]
      const isCustomRender = () => {
        return !!options?.render || !!getWellKnownComponent(context)(f)
      }

      if (isCustomRender()) return;
  
      if (f.repeated) {
        ret[f.name] = (ret[f.name] as unknown[]).map((value) => ({ $value: decode(value, f.resolvedType, options) }));
      } else if (f.map) {
        ret[f.name] = Object.entries(ret[f.name] as Record<string, unknown>).map(([$key, $value]) => ({
          $key,
          $value: decode($value, f.resolvedType, options),
        }));
      } else {
        ret[f.name] = decode(ret[f.name], f.resolvedType, options);
      }
    });
  
    return ret;
  };


  return decode
} 
