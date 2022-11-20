import React from 'react';
import { FieldValues } from 'react-hook-form';
import { FieldOptions } from './models';
import { AFFieldPath } from './types/path';

/**
 * AutoFormField allows you to customize each field in AutoForm.
 *
 * It delivers it's props to internal protobuf representation.
 *
 * @param props Render options of protobuf field.
 * @returns null
 */
const AutoFormField: {
  <
    TFieldValues extends FieldValues,
    TFieldName extends AFFieldPath<TFieldValues> = AFFieldPath<TFieldValues>,
  >(
    props: FieldOptions<TFieldValues, TFieldName>,
  ): JSX.Element;
  Rest: React.VFC;
} = (props) => <>{'this should not be rendered'}</>;

const AutoFormRestFields: React.VFC = (props: {}) => {
  console.warn('This component should not be rendered');
  return null;
};

AutoFormField.Rest = AutoFormRestFields;

export default AutoFormField;
