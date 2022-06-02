import React, { useEffect, useMemo } from 'react';
import protobuf from 'protobufjs';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import './index.css';
import Message from './protobuf/input/Message';
import ErrorAlert from './ErrorAlert';
import { finalize, protoObjToForm } from './protobuf/conversion';
import { AutoFormContext, AutoFormProvider } from './context';

interface AutoFormProps extends React.HTMLAttributes<HTMLFormElement> {
  descriptor: Record<string, unknown>
  messageType: string
  form?: UseFormReturn
  initialState?: Record<string, unknown>
  onSubmitValid?: (values: Record<string, unknown>) => void
  hideFieldType?: AutoFormContext['hideFieldType']
  fieldOverride?: AutoFormContext['fieldOverride']
  typeOverride?: AutoFormContext['typeOverride']
}

const AutoForm: React.FC<AutoFormProps> = ({
  descriptor,
  messageType,
  children,
  onSubmitValid,
  form,
  initialState,
  hideFieldType = false,
  fieldOverride = {},
  typeOverride = {},
  ...props
}) => {
  const ownForm = useForm();
  const methods = form ?? ownForm;
  const reflectionObj = useMemo(() => {
    try {
      const protoRoot = protobuf.Namespace.fromJSON('', descriptor);
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
      <AutoFormProvider value={{ hideFieldType, fieldOverride, typeOverride }}>
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
      </AutoFormProvider>
      <DevTool control={methods.control} />
    </FormProvider>
  );
};

export default AutoForm;
