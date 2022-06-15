import React, { useMemo } from 'react';
import AutoFormField, { FieldOptions } from './AutoFormField';

// TODO: change this into a hook using memo
// eslint-disable-next-line import/prefer-default-export
export const useChildFieldOptions = (options?: FieldOptions)
: Record<string, FieldOptions> => useMemo(() => {
  const { children } = options ?? {};
  if (!children) return {};
  const nodes: React.ReactElement[] = Array.isArray(children) ? children : [children];
  const fieldNodes = nodes.filter((node) => node.type === AutoFormField);
  return Object.fromEntries(fieldNodes.map(({ props }) => [props.name, props]));
}, [options?.children]);
