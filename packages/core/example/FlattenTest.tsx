import React from 'react';
import protobuf from 'protobufjs';
import descriptor from './proto.json';
import AutoForm from '../src/AutoForm';
import { OverriddenFieldProps } from '../src/models';

const namespace = protobuf.Namespace.fromJSON('', descriptor);

const { Field } = AutoForm;

const FlattenTest = () => (
  <div>
    <AutoForm
      messageType="User"
      namespace={namespace}
      onSubmitValid={(values) => {
        console.log(values);
      }}
    >
      <Field name="detail" flatten />

      <button type="submit" className="btn btn-xs btn-accent">
        Submit
      </button>
    </AutoForm>
  </div>
);

export default FlattenTest;
