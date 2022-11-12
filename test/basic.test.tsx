import protobuf from 'protobufjs';
import React from 'react';
import renderer from 'react-test-renderer';
import {
  describe, expect, it, test,
} from 'vitest';
import descriptor from '../example/proto.json';
import AutoForm from '../src/AutoForm';

const namespace = protobuf.Namespace.fromJSON('', descriptor);
const { Field } = AutoForm;

function toJson(component: renderer.ReactTestRenderer) {
  const result = component.toJSON();
  expect(result).toBeDefined();
  expect(result).not.toBeInstanceOf(Array);
  return result as renderer.ReactTestRendererJSON;
}

test('Snapshot test', () => {
  const component = renderer.create(
    <div>hi</div>,
  );
  const tree = toJson(component);
  expect(tree).toMatchSnapshot();
});

describe('rendering', () => {
  it('basic form rendering', () => {
    const component = renderer.create(
      <AutoForm namespace={namespace} messageType="User" />,
    );
    expect(component).toMatchSnapshot();
  });

  it('field name override', () => {
    const component = renderer.create(
      <AutoForm namespace={namespace} messageType="User">
        <Field name="name" label="User Name" />
      </AutoForm>,
    );
    expect(component).toMatchSnapshot();
  });
});
