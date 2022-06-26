import React, { useMemo, useCallback } from 'react';
import protobuf from 'protobufjs';
import { useAutoForm } from './context';
import AutoFormField, { FieldOptions } from './AutoFormField';

// TODO: change this into a hook using memo
export const useChildFields = (options?: FieldOptions) => useMemo(() => {
  const { children } = options ?? {};
  if (!children) {
    return {
      fieldOptions: {},
      fieldNodes: [],
      otherNodes: [],
      nodes: [],
    };
  }
  const nodes: React.ReactElement[] = Array.isArray(children) ? children : [children];
  const fieldNodes = nodes.filter((node) => node.type === AutoFormField);
  const otherNodes = nodes.filter((node) => node.type !== AutoFormField);

  const fieldOptions: Record<string, FieldOptions> = Object.fromEntries(
    fieldNodes.map(({ props }) => [props.name, props]),
  );

  return {
    fieldOptions, fieldNodes, otherNodes, nodes,
  };
}, [options?.children]);

export const useGetWellKnownComponent = () => {
  const { wellKnownFields, wellKnownTypes } = useAutoForm();

  return useCallback((field: protobuf.Field) => wellKnownTypes[field.resolvedType?.fullName ?? ''] ?? wellKnownFields[field.name ?? ''], [wellKnownFields, wellKnownTypes]);
};
