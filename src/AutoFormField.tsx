import React from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { FieldOptions } from './models';

/**
 * AutoFormField allows you to customize each field in AutoForm.
 *
 * It delivers it's props to internal protobuf representation.
 *
 * @param props Render options of protobuf field.
 * @returns null
 */
const AutoFormField = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
>(
  props: FieldOptions<TFieldValues, TFieldName>,
) => <>{'this should not be rendered'}</>;

const AutoFormRestFields: React.FC = (props: {}) => {
  console.warn('This component should not be rendered');
  return null;
};

AutoFormField.Rest = AutoFormRestFields;

export default AutoFormField;
