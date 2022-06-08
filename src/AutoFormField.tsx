import React from 'react';
import { OverriddenFieldProps } from './models';

export interface FieldProps {
  name: string
  label?: string
  render?: React.FunctionComponent<OverriddenFieldProps>
  disabled?: boolean
  hidden?: boolean
}

// eslint-disable-next-line no-unused-vars
const AutoFormField = (_props: FieldProps) => <>Field!</>;

export default AutoFormField;
