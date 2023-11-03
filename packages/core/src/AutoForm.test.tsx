import { describe, it, vi, expect } from 'vitest';
import { fireEvent, render, prettyDOM } from '@testing-library/react';
import { createAutoForm } from './AutoForm';
import { useForm } from 'react-hook-form';
import protobuf from 'protobufjs';
import React from 'react';

const namespace = protobuf.parse(`
syntax = "proto3";

message Child {
  map<int32, string> items = 1;
}

message Parent {
  repeated Child children = 1;
}
  `).root;

const MockApp: React.FC<{ onSubmit: (values: unknown) => void }> = (props) => {
  const form = useForm();
  const { AutoForm } = createAutoForm({
    form,
    messageType: 'Parent',
    namespace,
  })

  return <AutoForm onSubmitValid={props.onSubmit}><button id="submit">submit</button></AutoForm>
}

describe('AutoForm', () => {
  it('Form submission', async () => {
    const handleSubmit = vi.fn();
    const dom = render(<MockApp onSubmit={handleSubmit}><button id="submit" /></MockApp>);
    const submitButton = dom.container.querySelector('#submit');
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton!);
    await vi.waitFor(() => handleSubmit.mock.calls.length > 0);
    expect(handleSubmit.mock.calls.length).toBe(1);
  });
})
