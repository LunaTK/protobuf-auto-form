import React, { useEffect, useMemo } from 'react';
import protobuf from 'protobufjs';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import './index.css';
import Message from './protobuf/input/Message';
import ErrorAlert from './ErrorAlert';
import { finalize, protoObjToForm } from './protobuf/conversion';

interface AutoFormProps extends React.HTMLAttributes<HTMLFormElement> {
  descriptor: Record<string, unknown>
  messageType: string
  form?: UseFormReturn
  initialState?: Record<string, unknown>
  onSubmitValid?: (values: Record<string, unknown>) => void
}

const AutoForm: React.FC<AutoFormProps> = ({
  descriptor, messageType, children, onSubmitValid, form, initialState, ...props
}) => {
  const ownForm = useForm();
  const methods = form ?? ownForm;
  const reflectionObj = useMemo(() => {
    const protoRoot = protobuf.Namespace.fromJSON('', descriptor);
    try {
      return protoRoot.resolveAll().lookupType(messageType);
    } catch (e) {
      return null;
    }
  }, [descriptor, messageType]);

  useEffect(() => {
    if (!initialState || !reflectionObj) return;

    const formState = protoObjToForm(initialState, reflectionObj);
    methods.reset(formState as Record<string, unknown>);
  }, [initialState, reflectionObj, methods]);

  if (!reflectionObj) {
    return <ErrorAlert>{`Cannot find message type: ${messageType}`}</ErrorAlert>;
  }

  return (
    <FormProvider {...methods}>
      <form
        {...props}
        onSubmit={methods.handleSubmit((values) => {
          if (onSubmitValid) {
            onSubmitValid(finalize(values, reflectionObj));
          }
        })}
      >
        <Message type={reflectionObj} />
        {children}
      </form>
    </FormProvider>
  );
};

export default AutoForm;
