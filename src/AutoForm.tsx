import React, { useMemo } from 'react';
import protobuf from 'protobufjs';
import { FormProvider, useForm } from 'react-hook-form';
import './index.css';
import Message from './protobuf/input/Message';
import ErrorAlert from './ErrorAlert';

interface Props {
  descriptor: Record<string, unknown>
  messageType: string
  onSubmitValid?: (values: Record<string, unknown>) => void
}

const AutoForm: React.FC<Props> = ({
  descriptor, messageType, children, onSubmitValid,
}) => {
  const methods = useForm();
  const reflectionObj = useMemo(() => {
    const protoRoot = protobuf.Namespace.fromJSON('', descriptor);
    try {
      return protoRoot.resolveAll().lookupType(messageType);
    } catch (e) {
      return null;
    }
  }, [descriptor, messageType]);

  if (!reflectionObj) {
    return (
      <ErrorAlert>
        Message type does not exist:
        {' '}
        {messageType}
      </ErrorAlert>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((values) => {
        if (onSubmitValid) {
          onSubmitValid(values);
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
