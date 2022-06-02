import React, { createContext, useContext } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

interface OverriddenFieldProps {
  field: ControllerRenderProps
}

export interface AutoFormContext {
  hideFieldType: boolean
  fieldOverride: Record<string, React.FC<OverriddenFieldProps>>
  typeOverride: Record<string, React.FC<OverriddenFieldProps>>
}

const context = createContext<AutoFormContext>({
  hideFieldType: false,
  fieldOverride: {},
  typeOverride: {},
});

export const AutoFormProvider = context.Provider;
export const useAutoForm = () => useContext(context);
