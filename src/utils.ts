import React from 'react';
import AutoFormField, { FieldProps } from './AutoFormField';

// eslint-disable-next-line import/prefer-default-export
export const extractFields = (children?: React.ReactNode): React.ReactElement<FieldProps>[] => {
  if (!children) return [];
  const nodes: React.ReactElement[] = Array.isArray(children) ? children : [children];

  return nodes.filter((node) => node.type === AutoFormField);
};
