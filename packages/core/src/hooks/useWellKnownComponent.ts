import { useCallback } from 'react';
import protobuf from 'protobufjs';
import { AutoFormContext, useAutoFormCtx } from '../context';

export const getWellKnownComponent =
  ({ wellKnownTypes, wellKnownFields }: AutoFormContext) =>
  (field: protobuf.Field) =>
    wellKnownTypes[field.resolvedType?.fullName ?? ''] ??
    wellKnownFields[field.name ?? ''];

export const useGetWellKnownComponent = () => {
  const context = useAutoFormCtx();

  return useCallback(
    (field: protobuf.Field) => getWellKnownComponent(context)(field),
    [context],
  );
};
