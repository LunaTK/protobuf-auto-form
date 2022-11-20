import type {
  FieldPath,
  FieldPathValue,
  FieldValues,
  InternalFieldName,
  RegisterOptions,
  UseFormWatch,
} from 'react-hook-form';
import { RepeatId } from './types/autoFormState';
import { AFFieldPath } from './types/path';

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
  TFieldName extends InternalFieldName = InternalFieldName,
> {
  name: TFieldName | RepeatId;
  label?: string;
  render?: React.FC<OverriddenFieldProps>;
  readOnly?: boolean;
  hidden?: boolean;
  flatten?: boolean;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  children?: React.ReactNode;
  rules?: RegisterOptions;
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
