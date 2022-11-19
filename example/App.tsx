import React from 'react';
import protobuf from 'protobufjs';
import descriptor from './proto.json';
import { OverriddenFieldProps } from '../src/models';
import { Article__Output } from './pb/Article';
import createAutoForm from '../src/createAutoForm';

const namespace = protobuf.Namespace.fromJSON('', descriptor);

const { AutoForm, Field, FieldUntyped } = createAutoForm<Article__Output>();

const Referrers: React.VFC<
  OverriddenFieldProps<{
    [key: string]: number;
  }>
> = ({ value }) => {
  return <>{JSON.stringify(value, null, 2)}</>;
};

const initial = {
  title: 'hello',
  referrers: {
    user1: 123,
    user2: 321,
  } as { [key: string]: number },
  content: 'hihi',
  userId: 321,
  author: 'userId',
  test: [1, 2, 3],
};

const App = () => (
  <div>
    <AutoForm
      messageType="Article"
      namespace={namespace}
      onSubmitValid={(values) => {
        console.log(values);
      }}
    >
      <Field
        name="title"
        label="타이틀"
        rules={{
          required: '타이틀은 필수입니다.',
        }}
      />

      <Field name="detail">
        <Field name="detail.address" label="Your Address" />

        <Field name="detail.role" label="Your Role" flatten />
        <Field.Rest />
      </Field>

      <Field name="comments" label="코멘트">
        <Field name="$value">
          <Field name="comments.0.content" label="코멘트 내용" />
        </Field>
      </Field>

      <FieldUntyped name="referrers">
        <FieldUntyped name="$key" label="Test Key"></FieldUntyped>
      </FieldUntyped>

      <Field.Rest />

      <button type="submit" className="btn btn-xs btn-accent">
        Submit
      </button>
    </AutoForm>
  </div>
);

export default App;
