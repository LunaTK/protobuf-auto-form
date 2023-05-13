import React from 'react';
import { pascalCase } from 'change-case';

export const join = (parentName: string, name: string) =>
  parentName ? `${parentName}.${name}` : name;

export const makeHocName = (hoc: Function, original: React.FC<any>) => {
  return `${hoc.name}(${original.displayName || original.name})`;
};

export const toSpaceSeperated = (name: string) =>
  pascalCase(name).replace(/([A-Z][a-z])/g, ' $1').replace(/(\d)/g, ' $1');
