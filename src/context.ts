import React, { createContext, useContext } from 'react';
import { OverriddenFieldProps } from './models';

export interface AutoFormContext {
  hideFieldType: boolean
  camelCaseLabel: boolean
  fieldOverride: Record<string, React.FC<OverriddenFieldProps>>
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
