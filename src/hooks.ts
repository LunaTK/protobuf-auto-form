import React, { useMemo, useCallback } from 'react';
import protobuf from 'protobufjs';
import { useAutoForm } from './context';
import AutoFormField, { FieldOptions } from './AutoFormField';

type ChildFieldOptions = {
  $key?: FieldOptions
  $value?: FieldOptions
  [k: string]: FieldOptions | undefined
}

// TODO: change this into a hook using memo
export const useChildFields = (option?: FieldOptions) => useMemo(() => {
  const { children } = option ?? {};
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

  const fieldOptions: ChildFieldOptions = Object.fromEntries(
    fieldNodes.map(({ props }) => [props.name, props]),
  );

  return {
    fieldOptions, fieldNodes, otherNodes, nodes,
  };
}, [option?.children]);

export const useGetWellKnownComponent = () => {
  const { wellKnownFields, wellKnownTypes } = useAutoForm();

  return useCallback((field: protobuf.Field) => wellKnownTypes[field.resolvedType?.fullName ?? ''] ?? wellKnownFields[field.name ?? ''], [wellKnownFields, wellKnownTypes]);
};
