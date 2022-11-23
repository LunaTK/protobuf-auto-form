import React from 'react';
import protobuf from 'protobufjs';
import descriptor from './proto.json';
import { OverriddenFieldProps } from '../src/models';
import { Article__Output } from './pb/Article';
import { useAutoForm } from '../src/useAutoForm';

const namespace = protobuf.Namespace.fromJSON('', descriptor);

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

const App = () => {
  const { AutoForm, Field, form } = useAutoForm<Article__Output>({
    messageType: 'Article',
    namespace: namespace,
  });
  return (
    <div>
      <AutoForm
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
          <Field
            name="detail.address"
            label="Your Address"
            rules={{ required: true }}
          />

          <Field name="detail.role" label="Your Role" flatten />
          <Field.Rest />
        </Field>

        <Field
          name="comments"
          label="코멘트"
          rules={{ validate: (value) => value?.length === 1 }}
        >
          <Field name="comments.$value">
            <Field name="comments.$value.content" label="코멘트 내용" />
          </Field>
        </Field>

        <Field name="referrers">
          <Field name="referrers.$key" label="Test Key"></Field>
        </Field>

        <Field.Rest />

        <button type="submit" className="btn btn-xs btn-accent">
          Submit
        </button>
      </AutoForm>
    </div>
  );
};

export default App;
