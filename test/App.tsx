import React from 'react';
import descriptor from './proto.json';
import AutoForm from '../src/AutoForm';

const App = () => (
  <div>
    <AutoForm
      style={{ maxWidth: 500 }}
      messageType="Article"
      descriptor={descriptor}
      onSubmitValid={(values) => {
        console.log(values);
      }}
    >
      <button type="submit" className="btn btn-xs btn-accent">Submit</button>
    </AutoForm>
  </div>
);

export default App;
