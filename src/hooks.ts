import { useCallback } from 'react';
import protobuf from 'protobufjs';
import { useAutoForm } from './context';

// eslint-disable-next-line import/prefer-default-export
export const useGetOverriddenComponent = () => {
  const { fieldOverride, typeOverride } = useAutoForm();

  return useCallback((field: protobuf.Field) => typeOverride[field.resolvedType?.fullName ?? ''] ?? fieldOverride[field.name ?? ''], [fieldOverride, typeOverride]);
};
