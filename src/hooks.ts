import React, { useMemo, useCallback } from 'react';
import protobuf from 'protobufjs';
import { useAutoForm } from './context';
import { FieldOptions } from './models';
import { parseChildOptions } from './childField';

// TODO: change this into a hook using memo
export const useChildFields = (props?: FieldOptions) =>
  useMemo(() => parseChildOptions(props?.children), [props?.children]);

export const useGetWellKnownComponent = () => {
  const { wellKnownFields, wellKnownTypes } = useAutoForm();

  return useCallback(
    (field: protobuf.Field) =>
      wellKnownTypes[field.resolvedType?.fullName ?? ''] ??
      wellKnownFields[field.name ?? ''],
    [wellKnownFields, wellKnownTypes],
  );
};
