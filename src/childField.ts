import { ReactNode } from 'react';
import AutoFormField from './AutoFormField';
import { AutoFormContext } from './context';
import { ChildFieldProps } from './models';

export const parseChildOptions = (children: ReactNode | undefined) => {
  if (!children) {
    return {
      fieldOptions: {},
      fieldNodes: [],
      otherNodes: [],
      nodes: [],
    };
  }
  const nodes: React.ReactElement[] = Array.isArray(children) ? children : [children];
  const fieldNodes = nodes.filter((node) => node.type === AutoFormField);
  const otherNodes = nodes.filter((node) => node.type !== AutoFormField);

  const fieldOptions: ChildFieldProps = Object.fromEntries(fieldNodes.map(({ props }) => [props.name, props]));

  return {
    fieldOptions,
    fieldNodes,
    otherNodes,
    nodes,
  };
};

export const getWellKnownComponent =
  ({ wellKnownTypes, wellKnownFields }: AutoFormContext) =>
  (field: protobuf.Field) =>
    wellKnownTypes[field.resolvedType?.fullName ?? ''] ?? wellKnownFields[field.name ?? ''];
