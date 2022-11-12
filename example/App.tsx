import React from 'react';
import protobuf from 'protobufjs';
import descriptor from './proto.json';
import AutoForm from '../src/AutoForm';

const initialState = {
  title: 'Title example',
  type: '0',
  tags: ['tag 1', 'tag 2'],
  referrers: {
    user1: '12',
    user2: '33',
  },
  comments: [],
  content: 'this is a content',
  author: 'userId',
  userId: '7748',
};

const namespace = protobuf.Namespace.fromJSON('', descriptor);

const App = () => (
  <div>
    <AutoForm
      messageType="Article"
      namespace={namespace}
      onSubmitValid={(values) => {
        console.log(values);
      }}
    >
      <button type="submit" className="btn btn-xs btn-accent">
        Submit
      </button>
    </AutoForm>
  </div>
);

export default App;
