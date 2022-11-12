import React from 'react';
import protobuf from 'protobufjs';
import descriptor from './proto.json';
import AutoForm from '../src/AutoForm';
import { OverriddenFieldProps } from '../src/models';

const namespace = protobuf.Namespace.fromJSON('', descriptor);

const { Field } = AutoForm;

const Comment: React.VFC<
  OverriddenFieldProps<{
    author: string;
    content: string;

    _something: 's1' | 'type';
    s1?: string;
    type?: 'SIMPLE' | 'DETAILED';
  }>
> = ({ value }) => (
  <div>
    <div>Author : {value?.author}</div>
    <div>Content: {value?.content}</div>
  </div>
);

const initial = {
  title: 'hello',
  referrers: {
    user1: 123,
    user2: 321,
  },
  content: 'hihi',
  userId: 321,
  author: 'userId',
};

const App = () => (
  <div>
    <AutoForm
      messageType="Article"
      namespace={namespace}
      onSubmitValid={(values) => {
        console.log(values);
      }}
      initialState={initial}
    >
      <AutoForm.Field name="title" label="타이틀" disabled />
      <Field name="tags" hidden />

      <Field name="referrers" label="참조">
        <Field name="$key" label="주소" />
        <Field name="$value" label="횟수" />
      </Field>

      <Field name="comments" label="댓글" prepend={<b>오우예압</b>}>
        <Field name="$value" render={Comment} />
      </Field>

      <Field name="author" label="글쓴이">
        <Field name="nickname" label="닉네임" render={() => <div>hi</div>} />
      </Field>

      {/* <Field name="members">
        <Field name="value">
          <Field name="userId" disabled label="유저ID" />
          <Field name="friends" label="친구목록">
            <Field name="value" disabled />
          </Field>
        </Field>
      </Field> */}

      <button type="submit" className="btn btn-xs btn-accent">
        Submit
      </button>
    </AutoForm>
  </div>
);

export default App;
