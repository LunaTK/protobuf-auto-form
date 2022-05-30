import React from 'react';
import descriptor from './proto.json';
import AutoForm from '../src/AutoForm';

const App = () => (
  <div>
    <AutoForm messageType="Article" descriptor={descriptor} />
  </div>
);

export default App;
