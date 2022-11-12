import protobuf from "protobufjs"
import { getWellKnownComponent, parseChildOptions } from "../../childField";
import { AutoFormContext } from "../../context"
import { FieldOptions } from "../../models"

const isUnselectedOneofField = (data: any, field: protobuf.Field) => {
  if (!field.partOf) return false;
  return data[field.partOf.name] !== field.name;
};

const isRepeated = (field: protobuf.Field, value: unknown): value is { $value: unknown }[] => {
  return field.repeated
}

const isMap = (field: protobuf.Field, value: unknown): value is { $key: unknown, $value: unknown }[] => {
  return field.map
}

export const form2ProtoObj = (context: AutoFormContext) => {
  const encode = (formState: unknown, type: protobuf.Type | protobuf.Enum | null, fieldOptions?: FieldOptions): any => {
    if (formState === undefined || formState === null) return undefined
    if (!(type instanceof protobuf.Type)) return formState;
    if (typeof formState !== 'object') throw new Error('Invalid formState type', {cause: `Expected: object, Got: ${typeof formState}`})
    
    const { fieldOptions: childFieldOptions } = parseChildOptions(fieldOptions)

    const oneofSelection = Object.entries(formState).filter(([key]) => key in type.oneofs)

    const entries = Object.entries(formState)
      .filter(([key]) => {
        const isUnknownField = !(key in type.fields)
        return !isUnknownField && !isUnselectedOneofField(formState, type.fields[key])
      })
      .map(([key, value]) => {
        const field = type.fields[key]
        const options = childFieldOptions[key]

        const isCustomRender = () => {
          return !!options?.render || !!getWellKnownComponent(context)(field)
        }
        
        if (isCustomRender()){
          return [key, value]
        } if (isRepeated(field, value)) {
          return [key, value.map(({ $value }) => encode($value, field.resolvedType, options))]
        } else if (isMap(field, value)) {
          return [key, Object.fromEntries(value.map(({ $key, $value }) => [$key, encode($value, field.resolvedType, options)]))]
        }

        return [key, encode(value, field.resolvedType, options)]
      })
    console.log({entries, oneofSelection})

    return Object.fromEntries(entries.concat(oneofSelection))
  }

  return encode
}