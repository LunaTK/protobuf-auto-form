import React, { createContext, useContext } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

export interface AutoFormContext {
  hideFieldType: boolean
  fieldOverride: Record<string, React.FC<ControllerRenderProps>>
  typeOverride: Record<string, React.FC<ControllerRenderProps>>
}

const context = createContext<AutoFormContext>({
  hideFieldType: false,
  fieldOverride: {},
  typeOverride: {},
});

export const AutoFormProvider = context.Provider;
export const useAutoForm = () => useContext(context);
