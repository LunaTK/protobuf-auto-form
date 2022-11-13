import React, { useEffect, useMemo } from 'react';
import protobuf from 'protobufjs';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import './index.css';
import Message from './protobuf/input/primitive/Message';
import ErrorAlert from './common/ErrorAlert';
import { form2Proto, proto2Form } from './protobuf/conversion';
import { AutoFormContext, AutoFormProvider } from './context';
import AutoFormField from './AutoFormField';

export type AutoFormProps<T = any> = {
  namespace: protobuf.Namespace;
  messageType: string;
  form?: UseFormReturn;
  initialState?: T;
  onSubmitValid?: (values: T) => void;
} & React.HTMLAttributes<HTMLFormElement> &
  Partial<AutoFormContext>;

const AutoForm = <T,>(props: AutoFormProps<T>) => {
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

  const context: AutoFormContext = {
    hideFieldType,
    camelCaseLabel,
    wellKnownFields,
    wellKnownTypes,
    mode,
  };
  const dedicatedForm = useForm();
  const methods = form ?? dedicatedForm;
  const reflectionObj = useMemo(() => {
    try {
      return namespace.resolveAll().lookupType(messageType);
    } catch (e) {
      return null;
    }
  }, [namespace, messageType]);
  const options = { children, name: '' };
  useEffect(() => {
    if (!(initialState && reflectionObj)) return;

    const formState = proto2Form(context)(initialState, reflectionObj, options);
    console.log('Initial state decoded', formState);
    methods.reset(formState as Record<string, {}>);
  }, [initialState, reflectionObj]);

  if (!reflectionObj) {
    return (
      <ErrorAlert>{`Cannot find message type: ${messageType}`}</ErrorAlert>
    );
  }

  return (
    <FormProvider {...methods}>
      <AutoFormProvider value={context}>
        <form
          {...rest}
          onSubmit={methods.handleSubmit((values) => {
            console.log('Raw values : ', values);
            onSubmitValid?.(
              form2Proto(context)(values, reflectionObj, options),
            );
          })}
        >
          <Message type={reflectionObj} options={options} />
        </form>
      </AutoFormProvider>
    </FormProvider>
  );
};

AutoForm.Field = AutoFormField;

export default AutoForm;
