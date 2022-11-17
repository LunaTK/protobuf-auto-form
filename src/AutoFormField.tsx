import React from 'react';
import { FieldOptions } from './models';

/**
 * This component delivers it's props to internal protobuf representation.
 *
 * @param props Render options for protobuf fields
 * @returns null
 */
const AutoFormField = (props: FieldOptions) => (
  <>{'this should not be rendered'}</>
);

const AutoFormRestFields: React.FC = (props: {}) => {
  console.warn('This component should not be rendered');
  return null;
};

AutoFormField.Rest = AutoFormRestFields

export default AutoFormField;
