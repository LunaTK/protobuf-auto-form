import React, { useMemo } from 'react';
import protobuf from 'protobufjs';
import { FormProvider, useForm } from 'react-hook-form';
import './index.css';
import Message from './protobuf/input/Message';
import ErrorAlert from './ErrorAlert';

interface Props {
  descriptor: Record<string, any>
  messageType: string
}

const AutoForm: React.FC<Props> = ({ descriptor, messageType }) => {
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
        console.log('submitted: ', values);
      })}
      >
        <Message type={reflectionObj} />
        <button type="submit" className="btn btn-primary btn-sm">Submit</button>
      </form>
    </FormProvider>
  );
};

export default AutoForm;
