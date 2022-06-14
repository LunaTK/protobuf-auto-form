import React from 'react';
import renderer from 'react-test-renderer';
import { expect, test } from 'vitest';

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
