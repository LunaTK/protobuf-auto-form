import React from 'react';

interface Props {
  name: string
  type: string
}

const Field: React.FC<Props> = ({ name, type, children }) => (
  <>
    <span className="text-right inline-flex flex-col">
      <span className="leading-3 font-bold">
        {name}
      </span>
      <span className="text-slate-500 text-sm">
        (
        {type}
        )
      </span>
    </span>
    {children}
  </>
);

export default Field;
