import { UseFormWatch } from 'react-hook-form';

export interface OverriddenFieldProps<T = any> {
  watch: UseFormWatch<any>;
  value?: T | null;
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
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  children?: React.ReactNode;
}

export interface ChildFieldProps {
  $key?: FieldOptions;
  $value?: FieldOptions;
  [k: string]: FieldOptions | undefined;
}
