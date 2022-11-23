import { useMemo } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { createAutoForm } from './AutoForm';
import { AutoFormConfig } from './models';
import { AutoFormState } from './types/autoFormState';

export const useAutoForm = <TFieldValues extends FieldValues>(
  config: AutoFormConfig,
) => {
  type TState = AutoFormState<TFieldValues> & {};
  const form = useForm<TState>();
  const { namespace, wellKnownFields, wellKnownTypes, ...rest } = config;

  return useMemo(
    () => ({
      ...createAutoForm<TFieldValues>({ ...config, form }),
      form,
    }),
    [namespace, Object.values(rest).join(',')],
  );
};
