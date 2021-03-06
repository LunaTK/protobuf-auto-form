import React, { useMemo } from 'react';
import protobuf from 'protobufjs';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import './index.css';
import Message from './protobuf/input/Message';
import ErrorAlert from './common/ErrorAlert';
import { finalize, protoObjToForm } from './protobuf/conversion';
import { AutoFormContext, AutoFormProvider } from './context';

interface AutoFormProps extends React.HTMLAttributes<HTMLFormElement> {
  namespace: protobuf.Namespace
  messageType: string
  form?: UseFormReturn
  initialState?: Record<string, unknown>
  onSubmitValid?: (values: Record<string, unknown>) => void
  hideFieldType?: AutoFormContext['hideFieldType']
  camelCaseLabel?: AutoFormContext['camelCaseLabel']
  fieldOverride?: AutoFormContext['fieldOverride']
  typeOverride?: AutoFormContext['typeOverride']
}

const AutoForm: React.FC<AutoFormProps> = ({
  namespace,
  messageType,
  children,
  onSubmitValid,
  initialState,
  hideFieldType = false,
  camelCaseLabel = true,
  fieldOverride = {},
  typeOverride = {},
  ...props
}) => {
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
    </FormProvider>
  );
};

export default AutoForm;
