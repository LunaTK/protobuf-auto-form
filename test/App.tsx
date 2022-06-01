import React from 'react';
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

const App = () => (
  <div>
    <AutoForm
      style={{ maxWidth: 500 }}
      messageType="Article"
      descriptor={descriptor}
      onSubmitValid={(values) => {
        console.log(values);
      }}
      initialState={initialState}
    >
      <button type="submit" className="btn btn-xs btn-accent">Submit</button>
    </AutoForm>
  </div>
);

export default App;
