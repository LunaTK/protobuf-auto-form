import type {
  DefaultValues,
  FieldValues,
  RegisterOptions,
  UseFormWatch,
  Validate,
} from 'react-hook-form';
import type { AutoFormContext } from './context';
import type { AfFieldPath, AfFieldPathValue } from './types/path';

export interface OverriddenFieldProps<T = any> {
  watch: UseFormWatch<any>;
  value?: T;
  onChange?: (newValue?: T) => void;
  /**
   * Index of repeated or map field
   */
  index?: number;
  /**
   * Canonical field name
   */
  name?: string;
}

export interface FieldOptions<
  TFieldValues extends FieldValues = any,
  TFieldName extends AfFieldPath<TFieldValues> = AfFieldPath<TFieldValues>,
> {
  name: TFieldName;
  label?: string;
  render?: React.FC<
    OverriddenFieldProps<AfFieldPathValue<TFieldValues, TFieldName>>
  >;
  readOnly?: boolean;
  hidden?: boolean;
  flatten?: boolean;
  dropdown?: boolean;
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
  TFieldName extends AfFieldPath<TFieldValues>,
> = Omit<RegisterOptions, 'validate' | 'value'> & {
  validate?:
    | Validate<AfFieldPathValue<TFieldValues, TFieldName>>
    | Record<string, Validate<AfFieldPathValue<TFieldValues, TFieldName>>>;
  value?: AfFieldPathValue<TFieldValues, TFieldName>;
};

export type AutoFormConfig = {
  namespace: protobuf.Namespace;
  messageType: string;
} & Partial<AutoFormContext>;

export type AutoFormProps<T = any> = {
  initialState?: DefaultValues<T>;
  onSubmitValid?: (values: T) => void;
} & React.HTMLAttributes<HTMLFormElement>;
