import protobuf from "protobufjs";
import { getWellKnownComponent, parseChildOptions } from "../../childField";
import { AutoFormContext } from "../../context";
import { FieldOptions } from "../../models";

export type Convert = (
  from: unknown,
  type: protobuf.Type | protobuf.Enum | null,
  fieldOptions: FieldOptions | undefined
) => unknown;

export type ConvertValue = (
  convert: Convert,
  value: unknown,
  field: protobuf.Field,
  options: FieldOptions | undefined
) => unknown;

export const createConverter =
  (convertValue: ConvertValue) => (context: AutoFormContext) => {
    const convert = (
      fromObj: unknown,
      type: protobuf.Type | protobuf.Enum | null,
      fieldOptions: FieldOptions | undefined
    ): any => {
      if (fromObj === undefined || fromObj === null) return fromObj;
      if (!(type instanceof protobuf.Type)) return fromObj;
      const ret = { ...(fromObj as Record<string, unknown>) };
      const { fieldOptions: childFieldOptions } =
        parseChildOptions(fieldOptions);

      type.fieldsArray.forEach((f) => {
        if (!ret[f.name]) return;

        const options = childFieldOptions[f.name];
        const isCustomRender =
          !!options?.render || !!getWellKnownComponent(context)(f);

        if (isCustomRender) return;

        ret[f.name] = convertValue(convert, ret[f.name], f, options);
      });

      return ret;
    };

    return convert;
  };
