import React, { useMemo } from 'react';
import protobuf from 'protobufjs';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import './index.css';
import Message from './protobuf/input/Message';
import ErrorAlert from './common/ErrorAlert';
import { finalize, protoObjToForm } from './protobuf/conversion';
import { AutoFormContext, AutoFormProvider } from './context';

interface AutoFormProps<T = any> extends React.HTMLAttributes<HTMLFormElement> {
  namespace: protobuf.Namespace
  messageType: string
  form?: UseFormReturn
  initialState?: T
  onSubmitValid?: (values: T) => void
  hideFieldType?: AutoFormContext['hideFieldType']
  camelCaseLabel?: AutoFormContext['camelCaseLabel']
  wellKnownFields?: AutoFormContext['wellKnownFields']
  wellKnownTypes?: AutoFormContext['wellKnownTypes']
}

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
        hideFieldType, camelCaseLabel, wellKnownFields, wellKnownTypes,
      }}
      >
        <form
          {...rest}
          onSubmit={methods.handleSubmit((values) => {
            onSubmitValid?.(finalize(values, reflectionObj));
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
