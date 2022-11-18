import React, { useEffect, useMemo } from 'react';
import protobuf from 'protobufjs';
import { FormProvider, useForm } from 'react-hook-form';
import './index.css';
import Message from './protobuf/input/primitive/Message';
import ErrorAlert from './common/ErrorAlert';
import { form2Proto, proto2Form } from './protobuf/conversion';
import { AutoFormContext, AutoFormProvider } from './context';
import AutoFormField from './AutoFormField';
import { fillInitialValues } from './protobuf/conversion/initial';

export type AutoFormProps<T = any> = {
  namespace: protobuf.Namespace;
  messageType: string;
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
    ...rest
  } = props;

  const context: AutoFormContext = {
    hideFieldType,
    camelCaseLabel,
    wellKnownFields,
    wellKnownTypes,
  };
  const options = { children, name: '' };
  const reflectionObj = useMemo(() => {
    try {
      return namespace.resolveAll().lookupType(messageType);
    } catch (e) {
      return null;
    }
  }, [namespace, messageType]);
  const methods = useForm();
  useEffect(() => {
    const initial = proto2Form(context)(
      fillInitialValues(initialState ?? {}, reflectionObj),
      reflectionObj,
      options,
    );
    console.log('<AutoForm> initial', initial);
    methods.reset(initial);
  }, [initialState]);

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
            console.log('AutoForm Submitted : ', values);
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
