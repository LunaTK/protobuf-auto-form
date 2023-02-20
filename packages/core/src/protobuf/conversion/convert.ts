import protobuf from "protobufjs";
import { AutoFormContext } from "../../context";
import { parseChildOptions, getWellKnownComponent } from "../../hooks";
import { ChildFieldProps, FieldOptions } from "../../models";
import { getInitialValue } from "./initial";

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
        parseChildOptions(fieldOptions?.children);

      const convertField = (cfo?: ChildFieldProps) => (f: protobuf.Field) => {
        const options = cfo && cfo[f.name]
        const isCustomRender =
          !!options?.render || !!getWellKnownComponent(context)(f);

        if (isCustomRender && !ret[f.name]) {
          ret[f.name] = getInitialValue(f);
        }
        if (!ret[f.name]) return;

        if (!isCustomRender) {
          ret[f.name] = convertValue(convert, ret[f.name], f, options);
        }
      }

      type.oneofsArray.forEach((oneof) => {
        const oneofOptions = childFieldOptions[oneof.name]
        const cfo = parseChildOptions(oneofOptions?.children).fieldOptions
        oneof.fieldsArray.forEach(convertField(cfo))
      })

      type.fieldsArray.forEach((f) => {
        if (f.partOf) return; // skip oneof fields
        convertField(childFieldOptions)(f)
      });

      return ret;
    };

    return convert;
  };
