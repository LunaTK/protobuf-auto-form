import React, { useMemo, useCallback } from 'react';
import protobuf from 'protobufjs';
import { useAutoForm } from './context';
import AutoFormField, { FieldOptions } from './AutoFormField';

// TODO: change this into a hook using memo
export const useChildFieldOptions = (options?: FieldOptions)
: Record<string, FieldOptions> => useMemo(() => {
  const { children } = options ?? {};
  if (!children) return {};
  const nodes: React.ReactElement[] = Array.isArray(children) ? children : [children];
  const fieldNodes = nodes.filter((node) => node.type === AutoFormField);
  return Object.fromEntries(fieldNodes.map(({ props }) => [props.name, props]));
}, [options?.children]);

export const useGetWellKnownComponent = () => {
  const { wellKnownFields, wellKnownTypes } = useAutoForm();

  return useCallback((field: protobuf.Field) => wellKnownTypes[field.resolvedType?.fullName ?? ''] ?? wellKnownFields[field.name ?? ''], [wellKnownFields, wellKnownTypes]);
};
