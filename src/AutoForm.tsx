import React, { useEffect, useMemo } from 'react';
import protobuf from 'protobufjs';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import './index.css';
import Message from './protobuf/input/primitive/Message';
import ErrorAlert from './common/ErrorAlert';
import { form2ProtoObj, protoObj2Form } from './protobuf/conversion';
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
    form,
    ...rest
  } = props;
  const dedicatedForm = useForm();
  const methods = form ?? dedicatedForm;
  const reflectionObj = useMemo(() => {
    try {
      return namespace.resolveAll().lookupType(messageType);
    } catch (e) {
      return null;
    }
  }, [namespace, messageType]);
  useEffect(() => {
    if (!initialState || !reflectionObj) return;

    const formState = protoObj2Form(initialState, reflectionObj);
    methods.reset(formState as Record<string, {}>);
  }, [initialState, reflectionObj]);

  if (!reflectionObj) {
    return <ErrorAlert>{`Cannot find message type: ${messageType}`}</ErrorAlert>;
  }

  const context: AutoFormContext = {
    hideFieldType, camelCaseLabel, wellKnownFields, wellKnownTypes, mode,
  }

  return (
    <FormProvider {...methods}>
      <AutoFormProvider value={context}
      >
        <form
          {...rest}
          onSubmit={methods.handleSubmit((values) => {
            onSubmitValid?.(form2ProtoObj(context)(values, reflectionObj));
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
