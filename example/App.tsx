import React from 'react';
import protobuf from 'protobufjs';
import descriptor from './proto.json';
import { createAutoForm } from '../src/AutoForm';
import { OverriddenFieldProps } from '../src/models';
import { Article__Output } from './pb/Article';

const namespace = protobuf.Namespace.fromJSON('', descriptor);

const { AutoForm } = createAutoForm<Article__Output>();

const { Field } = AutoForm;

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
      <AutoForm.Field
        name="title"
        label="타이틀"
        rules={{
          required: '타이틀은 필수입니다.',
        }}
      />

      <AutoForm.Field name="detail">
        <AutoForm.Field name="detail.address" label="Your Address" />

        <AutoForm.Field name="detail.role" label="Your Role" flatten />
        <AutoForm.Field.Rest />
      </AutoForm.Field>

      <AutoForm.Field name="comments" label="코멘트">
        <AutoForm.Field name="comments.0">
          <AutoForm.Field name="comments.0.content" label="코멘트 내용" />
        </AutoForm.Field>
      </AutoForm.Field>

      <AutoForm.Field.Rest />

      <button type="submit" className="btn btn-xs btn-accent">
        Submit
      </button>
    </AutoForm>
  </div>
);

export default App;
