import React, { createContext, useContext } from 'react';
import { OverriddenFieldProps } from './models';

export interface AutoFormContext {
  hideFieldType: boolean;
  camelCaseLabel: boolean;
  mode: 'implicit' | 'explicit';
  wellKnownFields: Record<string, React.FC<OverriddenFieldProps>>;
  wellKnownTypes: Record<string, React.FC<OverriddenFieldProps>>;
}

const context = createContext<AutoFormContext>({
  hideFieldType: false,
  camelCaseLabel: false,
  mode: 'implicit',
  wellKnownFields: {},
  wellKnownTypes: {},
});

export const AutoFormProvider = context.Provider;
export const useAutoFormCtx = () => useContext(context);
