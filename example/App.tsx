import React from 'react';
import protobuf from 'protobufjs';
import descriptor from './proto.json';
import AutoForm from '../src/AutoForm';

const namespace = protobuf.Namespace.fromJSON('', descriptor);

const { Field } = AutoForm;

const App = () => (
  <div>
    <AutoForm
      messageType="Article"
      namespace={namespace}
      onSubmitValid={(values) => {
        console.log(values);
      }}
    >
      <Field name="title" label="타이틀" disabled />
      <Field name="tags" hidden />

      <Field name="referrers" label="참조">
        <Field name="key" label="주소" />
        <Field name="value" label="횟수" />
      </Field>

      <Field name="comments" label="댓글">
        <Field name="author" label="글쓴이" disabled />
      </Field>

      <button type="submit" className="btn btn-xs btn-accent">Submit</button>
    </AutoForm>
  </div>
);

export default App;
