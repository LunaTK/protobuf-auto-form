import React from 'react';
import protobuf from 'protobufjs';
import descriptor from './proto.json';
import { createAutoForm } from '../src/AutoForm';
import { OverriddenFieldProps } from '../src/models';

const namespace = protobuf.Namespace.fromJSON('', descriptor);

const { AutoForm } = createAutoForm<typeof initial>();

const { Field } = AutoForm;

const Comment: React.VFC<
  OverriddenFieldProps<{
    author: string;
    content: string;

    _something: 's1' | 'type';
    s1?: string;
    type?: 'SIMPLE' | 'DETAILED';
  }>
> = ({ value, onChange }) => (
  <div>
    <input
      placeholder="Author"
      className="text-red-500"
      value={value?.author}
      onChange={(e) => onChange({ ...value, author: e.target.value })}
    />
    <div>Content: {value?.content}</div>
  </div>
);

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
      initialState={{
        author: 'userId',
      }}
    >
      <AutoForm.Field
        name="title"
        label="타이틀"
        rules={{
          required: '타이틀은 필수입니다.',
        }}
      />

      <button type="submit" className="btn btn-xs btn-accent">
        Submit
      </button>
    </AutoForm>
  </div>
);

export default App;
