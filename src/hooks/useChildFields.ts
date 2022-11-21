import { isValidElement, ReactElement, ReactNode, useMemo } from 'react';
import AutoFormField from '../AutoFormField';
import type { ChildFieldProps, FieldOptions } from '../models';

const asArray = (children: ReactNode): React.ReactNode[] =>
  Array.isArray(children) ? children : [children];

export const isAutoFormField = (
  child: ReactNode,
): child is ReactElement<FieldOptions> => {
  return isValidElement(child) && child?.type === AutoFormField;
};

const parseFieldName = (name: string) => {
  const parts = name.split('.');
  const last = parts[parts.length - 1];
  if (!Number.isNaN(Number(last))) {
    return '$value';
  }

  return last;
};

const parseNodes = (children: ReactNode) => {
  return asArray(children).map((child) => {
    if (isAutoFormField(child)) {
      return {
        ...child,
        props: { ...child.props, name: parseFieldName(child.props.name) },
      };
    }
    return child;
  });
};

export const parseChildOptions = (children: ReactNode) => {
  if (!children) {
    return {
      fieldOptions: {},
      fieldNodes: [],
      otherNodes: [],
      nodes: [],
    };
  }
  const nodes = parseNodes(children);
  const fieldNodes = nodes.filter(isAutoFormField);
  const otherNodes = nodes.filter((node) => !isAutoFormField(node));

  const fieldOptions: ChildFieldProps = Object.fromEntries(
    fieldNodes.map(({ props }) => [props.name, props]),
  );

  return {
    fieldOptions,
    fieldNodes,
    otherNodes,
    nodes,
  };
};

// TODO: change this into a hook using memo
export const useChildFields = (props?: FieldOptions) =>
  useMemo(() => parseChildOptions(props?.children), [props?.children]);
