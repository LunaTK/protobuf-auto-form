import type {
  FieldValues,
  RegisterOptions,
  UseFormWatch,
  Validate,
} from 'react-hook-form';
import { AFFieldPath, AFFieldPathValue } from './types/path';

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
  TFieldValues extends FieldValues = any,
  TFieldName extends AFFieldPath<TFieldValues> = AFFieldPath<TFieldValues>,
> {
  name: TFieldName;
  label?: string;
  render?: React.FC<
    OverriddenFieldProps<AFFieldPathValue<TFieldValues, TFieldName>>
  >;
  readOnly?: boolean;
  hidden?: boolean;
  flatten?: boolean;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  children?: React.ReactNode;
  rules?: AfRegisterOptions<TFieldValues, TFieldName>;
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

export type AfRegisterOptions<
  TFieldValues extends FieldValues,
  TFieldName extends AFFieldPath<TFieldValues>,
> = Omit<RegisterOptions, 'validate' | 'value'> & {
  validate?:
    | Validate<AFFieldPathValue<TFieldValues, TFieldName>>
    | Record<string, Validate<AFFieldPathValue<TFieldValues, TFieldName>>>;
  value?: AFFieldPathValue<TFieldValues, TFieldName>;
};
