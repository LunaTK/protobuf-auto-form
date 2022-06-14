import React from 'react';
import AutoFormField, { FieldOptions } from './AutoFormField';

// eslint-disable-next-line import/prefer-default-export
export const extractFields = (children?: React.ReactNode): Record<string, FieldOptions> => {
  if (!children) return {};
  const nodes: React.ReactElement[] = Array.isArray(children) ? children : [children];
  const fieldNodes = nodes.filter((node) => node.type === AutoFormField);
  return Object.fromEntries(fieldNodes.map(({ props }) => [props.name, props]));
};
