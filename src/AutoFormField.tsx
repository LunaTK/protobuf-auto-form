import React from 'react';
import { OverriddenFieldProps } from './models';

export interface FieldOptions {
  name: string
  label?: string
  render?: React.FunctionComponent<OverriddenFieldProps>
  disabled?: boolean
  hidden?: boolean
  append?: React.ReactNode
  prepend?: React.ReactNode
  children?: React.ReactNode
}

// eslint-disable-next-line no-unused-vars
const AutoFormField = (_props: FieldOptions) => <>Field!</>;

export default AutoFormField;