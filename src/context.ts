import React, { createContext, useContext } from 'react';
import { OverriddenFieldProps } from './models';

export interface AutoFormContext<T = any> {
  hideFieldType: boolean
  camelCaseLabel: boolean
  fieldOverride: Partial<{
    [field in keyof T]: React.FC<OverriddenFieldProps<T[field]>>
  }>
  typeOverride: Record<string, React.FC<OverriddenFieldProps>>
}

const context = createContext<AutoFormContext>({
  hideFieldType: false,
  camelCaseLabel: false,
  fieldOverride: {},
  typeOverride: {},
});

export const AutoFormProvider = context.Provider;
export const useAutoForm = () => useContext(context);
