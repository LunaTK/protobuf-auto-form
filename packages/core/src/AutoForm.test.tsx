import { describe, it, vi, expect, afterEach } from "vitest";
import {
  fireEvent,
  render,
  prettyDOM,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { createAutoForm } from "./AutoForm";
import { useForm } from "react-hook-form";
import protobuf from "protobufjs";
import React from "react";

interface MockAppProps {
  onSubmit: (values: unknown) => void;
  namespace: protobuf.Namespace;
  messageType: string;
}

const MockApp: React.FC<MockAppProps> = (props) => {
  const form = useForm();
  const { AutoForm } = createAutoForm({
    form,
    messageType: props.messageType,
    namespace: props.namespace,
  });

  return (
    <AutoForm onSubmitValid={props.onSubmit}>
      <button id="submit">submit</button>
    </AutoForm>
  );
};

afterEach(cleanup);

describe("AutoForm", () => {
  it("Add repeated item", async () => {
    const namespace = protobuf.parse(`
      syntax = "proto3";

      message RepeatedString {
        repeated string children = 1;
      }
    `).root;

    const handleSubmit = vi.fn();
    const dom = render(
      <MockApp
        onSubmit={handleSubmit}
        namespace={namespace}
        messageType="RepeatedString"
      >
        <button id="submit" />
      </MockApp>
    );
    fireEvent.click(dom.queryByTestId("add-btn")!);
    await vi.waitUntil(() => dom.queryByTestId("delete-btn") !== null);
    fireEvent.click(dom.container.querySelector("#submit")!);
    await waitFor(() =>
      expect(
        handleSubmit,
        "handleSubmit should be called"
      ).toHaveBeenCalledTimes(1)
    );

    expect(
      handleSubmit.mock.calls[0],
      "repeated element should be added"
    ).toEqual([{ children: [""] }]);
  });

  it('Add repeated item', async () => {
    const namespace = protobuf.parse(`
      syntax = "proto3";

      message Child {
        map<string, string> val = 1;
      }

      message Parent {
        repeated Child children = 1;
      }
    `).root;

    const handleSubmit = vi.fn();
    const dom = render(
      <MockApp
        onSubmit={handleSubmit}
        namespace={namespace}
        messageType="Parent"
      >
        <button id="submit" />
      </MockApp>
    );
    
    fireEvent.click(dom.queryByTestId("add-btn")!);
    await vi.waitUntil(() => dom.queryByTestId("delete-btn") !== null);
    fireEvent.click(dom.container.querySelector("#submit")!);
    await waitFor(() => handleSubmit.mock.calls.length === 1);

    expect(
      handleSubmit.mock.calls[0],
      "repeated element with map should work"
    ).toEqual([{ children: [{ val: {} }] }]);
  })


  it('Add nested map', async () => {
    const namespace = protobuf.parse(`
      syntax = "proto3";

      message Child {
        map<string, string> val = 1;
      }

      message Parent {
        map<string, Child> children = 1;
      }
    `).root;

    const handleSubmit = vi.fn();
    const dom = render(
      <MockApp
        onSubmit={handleSubmit}
        namespace={namespace}
        messageType="Parent"
      >
        <button id="submit" />
      </MockApp>
    );
    
    fireEvent.click(dom.queryByTestId("add-btn")!);
    await vi.waitUntil(() => dom.queryByTestId("delete-btn") !== null);
    fireEvent.click(dom.container.querySelector("#submit")!);
    await waitFor(() => handleSubmit.mock.calls.length === 1);

    expect(
      handleSubmit.mock.calls[0],
      "repeated element with map should work"
    ).toEqual([{ children: {"": {"val": {}}} }]);
  })
});
