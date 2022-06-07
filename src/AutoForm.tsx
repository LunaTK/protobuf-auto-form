import React, { useMemo } from 'react';
import protobuf from 'protobufjs';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import './index.css';
import Message from './protobuf/input/Message';
import ErrorAlert from './common/ErrorAlert';
import { finalize, protoObjToForm } from './protobuf/conversion';
import { AutoFormContext, AutoFormProvider } from './context';

interface AutoFormProps<T> extends React.HTMLAttributes<HTMLFormElement> {
  namespace: protobuf.Namespace
  messageType: string
  form?: UseFormReturn
  initialState?: T
  onSubmitValid?: (values: T) => void
  hideFieldType?: AutoFormContext<T>['hideFieldType']
  camelCaseLabel?: AutoFormContext<T>['camelCaseLabel']
  fieldOverride?: AutoFormContext<T>['fieldOverride']
  typeOverride?: AutoFormContext<T>['typeOverride']
}

const AutoForm = <T, >({
  namespace,
  messageType,
  children,
  onSubmitValid,
  initialState,
  hideFieldType = false,
  camelCaseLabel = true,
  fieldOverride = {},
  typeOverride = {},
  ...rest
}: AutoFormProps<T>) => {
  const reflectionObj = useMemo(() => {
    try {
      return namespace.resolveAll().lookupType(messageType);
    } catch (e) {
      return null;
    }
  }, [namespace, messageType]);
  const defaultValues = useMemo(() => {
    if (!initialState || !reflectionObj) return undefined;

    const formState = protoObjToForm(initialState, reflectionObj);
    return formState as Record<string, {}>;
  }, [initialState, reflectionObj]);

  const methods = useForm({ defaultValues });

  if (!reflectionObj) {
    return <ErrorAlert>{`Cannot find message type: ${messageType}`}</ErrorAlert>;
  }

  return (
    <FormProvider {...methods}>
      <AutoFormProvider value={{
        hideFieldType, camelCaseLabel, fieldOverride, typeOverride,
      }}
      >
        <form
          {...rest}
          onSubmit={methods.handleSubmit((values) => {
            if (onSubmitValid) {
              onSubmitValid(finalize(values, reflectionObj));
            }
          })}
        >
          <Message type={reflectionObj} />
          {children}
        </form>
      </AutoFormProvider>
    </FormProvider>
  );
};

export default AutoForm;
