import type {
  FieldPath,
  FieldPathValue,
  FieldValues,
  RegisterOptions,
  UseFormWatch,
} from 'react-hook-form';
import { RepeatId } from './types/autoFormState';

export interface OverriddenFieldProps<T = any> {
  watch: UseFormWatch<any>;
  value: T;
  onChange: (newValue?: T) => void;
  /**
   * Index of repeated or map field
   */
  index?: number;
  /**
   * Canonical field name
   */
  name: string;
}

export interface FieldOptions<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TFieldName | RepeatId;
  label?: string;
  render?: React.FC<
    OverriddenFieldProps<FieldPathValue<TFieldValues, TFieldName>>
  >;
  readOnly?: boolean;
  hidden?: boolean;
  flatten?: boolean;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  children?: React.ReactNode;
  rules?: RegisterOptions<TFieldValues, TFieldName>;
}

export interface ChildFieldProps {
  $key?: FieldOptions;
  $value?: FieldOptions;
  [k: string]: FieldOptions | undefined;
}

export interface InputProps {
  name: string;
  error?: any;
  options?: FieldOptions;
}
