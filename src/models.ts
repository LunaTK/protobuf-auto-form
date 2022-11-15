import { UseFormWatch } from 'react-hook-form';

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

export interface FieldOptions {
  name: string;
  label?: string;
  render?: React.FunctionComponent<OverriddenFieldProps>;
  disabled?: boolean;
  hidden?: boolean;
  flatten?: boolean;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  children?: React.ReactNode;
}

export interface ChildFieldProps {
  $key?: FieldOptions;
  $value?: FieldOptions;
  [k: string]: FieldOptions | undefined;
}

export type RepeatedElement<T = unknown> = {
  $value: T;
};

export type MapElement<K = string, V = unknown> = {
  $key: K;
  $value: V;
};
