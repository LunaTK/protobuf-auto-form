import React, { useEffect, useMemo } from 'react';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';
import './index.css';
import Message from './protobuf/input/primitive/Message';
import ErrorAlert from './common/ErrorAlert';
import {
  form2Proto,
  proto2Form,
  pruneUnselectedOneofValues,
} from './protobuf/conversion';
import { AutoFormContext, AutoFormProvider } from './context';
import { fillInitialValues } from './protobuf/conversion/initial';
import AutoFormField, { TypedField } from './AutoFormField';
import { AutoFormConfig, AutoFormProps } from './models';

export const createAutoForm = <TFieldValues extends FieldValues>(
  config: AutoFormConfig & { form: UseFormReturn<any> },
) => {
  const {
    namespace,
    messageType,
    form: methods,
    hideFieldType = false,
    camelCaseLabel = true,
    hideEmptyMessage = false,
    mode = 'implicit',
    wellKnownFields = {},
    wellKnownTypes = {},
  } = config;

  const context: AutoFormContext = {
    hideFieldType,
    camelCaseLabel,
    hideEmptyMessage,
    mode,
    wellKnownFields,
    wellKnownTypes,
  };

  const reflectionObj = (() => {
    try {
      return namespace.resolveAll().lookupType(messageType);
    } catch (e) {
      return null;
    }
  })();

  const AutoForm: React.FC<AutoFormProps<TFieldValues>> = (props) => {
    const { children, initialState, onSubmitValid, ...rest } = props;
    const options = { children, name: '' };
    useEffect(() => {
      const initial = proto2Form(context)(
        fillInitialValues(initialState ?? {}, reflectionObj),
        reflectionObj,
        options,
      );
      console.log('<AutoForm> initial', initial);
      setTimeout(() => methods.reset(initial)); // TODO: why is this necessary?
    }, []);

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
              const finalized = pruneUnselectedOneofValues(
                form2Proto(context)(values, reflectionObj, options),
                reflectionObj,
              );
              onSubmitValid?.(finalized);
            })}
          >
            <Message type={reflectionObj} options={options} name="" />
          </form>
        </AutoFormProvider>
      </FormProvider>
    );
  };

  const TField: TypedField<TFieldValues> = AutoFormField;
  const TFieldUntyped: TypedField<Record<string, any>> = AutoFormField;
  AutoForm.displayName = `AutoForm(${config.messageType})`;

  return { AutoForm, Field: TField, FieldUntyped: TFieldUntyped };
};
