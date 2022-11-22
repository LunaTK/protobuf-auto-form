import React from 'react';

export const join = (parentName: string, name: string) =>
  parentName ? `${parentName}.${name}` : name;

export const makeHocName = (hoc: Function, original: React.FC<any>) => {
  return `${hoc.name}(${original.displayName || original.name})`;
};
