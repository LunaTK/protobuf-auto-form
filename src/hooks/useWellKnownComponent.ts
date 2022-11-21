import { useCallback } from 'react';
import protobuf from 'protobufjs';
import { AutoFormContext, useAutoForm } from '../context';

export const getWellKnownComponent =
  ({ wellKnownTypes, wellKnownFields }: AutoFormContext) =>
  (field: protobuf.Field) =>
    wellKnownTypes[field.resolvedType?.fullName ?? ''] ??
    wellKnownFields[field.name ?? ''];

export const useGetWellKnownComponent = () => {
  const context = useAutoForm();

  return useCallback(
    (field: protobuf.Field) => getWellKnownComponent(context)(field),
    [context],
  );
};
