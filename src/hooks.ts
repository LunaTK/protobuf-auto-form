import { useCallback } from 'react';
import protobuf from 'protobufjs';
import { useAutoForm } from './context';

// eslint-disable-next-line import/prefer-default-export
export const useGetWellKnownComponent = () => {
  const { wellKnownFields, wellKnownTypes } = useAutoForm();

  return useCallback((field: protobuf.Field) => wellKnownTypes[field.resolvedType?.fullName ?? ''] ?? wellKnownFields[field.name ?? ''], [wellKnownFields, wellKnownTypes]);
};
