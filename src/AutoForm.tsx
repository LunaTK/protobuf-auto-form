import React, { useMemo } from 'react';
import protobuf from 'protobufjs';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import './index.css';
import Message from './protobuf/input/primitive/Message';
import ErrorAlert from './common/ErrorAlert';
import { finalize, protoObjToForm } from './protobuf/conversion';
import { AutoFormContext, AutoFormProvider } from './context';
import AutoFormField from './AutoFormField';

export type AutoFormProps<T = any> = {
  namespace: protobuf.Namespace
  messageType: string
  form?: UseFormReturn
  initialState?: T
  onSubmitValid?: (values: T) => void
} & React.HTMLAttributes<HTMLFormElement> & Partial<AutoFormContext>

const AutoForm = <T, >(props: AutoFormProps<T>) => {
  const {
    namespace,
    messageType,
    children,
    onSubmitValid,
    initialState,
    hideFieldType = false,
    camelCaseLabel = true,
    wellKnownFields = {},
    wellKnownTypes = {},
    mode = 'autofill',
    ...rest
  } = props;
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
        hideFieldType, camelCaseLabel, wellKnownFields, wellKnownTypes, mode,
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
          <Message type={reflectionObj} options={{ children, name: '' }} />
        </form>
      </AutoFormProvider>
    </FormProvider>
  );
};

AutoForm.Field = AutoFormField;

export default AutoForm;
