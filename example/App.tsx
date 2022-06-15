import React from 'react';
import protobuf from 'protobufjs';
import descriptor from './proto.json';
import AutoForm from '../src/AutoForm';

const namespace = protobuf.Namespace.fromJSON('', descriptor);

const { Field } = AutoForm;

const App = () => (
  <div>
    <AutoForm
      messageType="Guild"
      namespace={namespace}
      onSubmitValid={(values) => {
        console.log(values);
      }}
    >
      {/* <Field name="title" label="타이틀" disabled />
      <Field name="tags" hidden />

      <Field name="referrers" label="참조">
        <Field name="key" label="주소" />
        <Field name="value" label="횟수" />
      </Field>

      <Field name="comments" label="댓글">
        <Field name="author" label="글쓴이" disabled />
      </Field>

      <Field name="author" label="글쓴이">
        <Field name="nickname" label="닉네임" />
      </Field> */}

      <Field name="members">
        <Field name="value">
          <Field name="userId" disabled label="유저ID" />
          <Field name="friends" label="친구목록">
            <Field name="value" disabled />
          </Field>
        </Field>
      </Field>

      <button type="submit" className="btn btn-xs btn-accent">Submit</button>
    </AutoForm>
  </div>
);

export default App;
