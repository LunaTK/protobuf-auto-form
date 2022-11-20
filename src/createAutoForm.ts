import { FieldPath, FieldValues } from "react-hook-form";
import AutoForm from "./AutoForm";
import AutoFormField from "./AutoFormField";
import { FieldOptions } from "./models";
import { AfFieldPath } from "./types/path";

type TypedField<TFieldValues extends FieldValues> = {
  <TName extends AfFieldPath<TFieldValues> = AfFieldPath<TFieldValues>>(
    props: FieldOptions<TFieldValues, TName>,
  ): JSX.Element;
  Rest: React.FC;
}

export const createAutoForm = <
  TFieldValues extends FieldValues = FieldValues,
>() => {
  const TAutoForm = AutoForm<TFieldValues>
  const TField: TypedField<TFieldValues> = AutoFormField;
  const TFieldUntyped: TypedField<Record<string, any>> = AutoFormField;

  return { AutoForm: TAutoForm, Field: TField, FieldUntyped: TFieldUntyped };
};
