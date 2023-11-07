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

const namespace = protobuf.parse(`
syntax = "proto3";

message GrandChild {
  map<int32, string> items = 1;
}

message Child {
  GrandChild gc = 1;
}

message Parent {
  repeated string children = 1;
}
  `).root;

const MockApp: React.FC<{ onSubmit: (values: unknown) => void }> = (props) => {
  const form = useForm();
  const { AutoForm } = createAutoForm({
    form,
    messageType: "Parent",
    namespace,
  });

  return (
    <AutoForm onSubmitValid={props.onSubmit}>
      <button id="submit">submit</button>
    </AutoForm>
  );
};

afterEach(cleanup);

describe("AutoForm", () => {
  it("Form submission", async () => {
    const handleSubmit = vi.fn();
    const dom = render(
      <MockApp onSubmit={handleSubmit}>
        <button id="submit" />
      </MockApp>
    );
    const submitButton = dom.container.querySelector("#submit");
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton!);
    await vi.waitFor(() => handleSubmit.mock.calls.length > 0);
    expect(handleSubmit.mock.calls.length).toBe(1);
  });

  it("Add map item", async () => {
    const handleSubmit = vi.fn();
    const dom = render(
      <MockApp
        onSubmit={(values) => {
          console.log(values);
          handleSubmit(values);
        }}
      >
        <button id="submit" />
      </MockApp>
    );
    fireEvent.click(dom.queryByTestId("add-btn")!);
    await vi.waitUntil(() => dom.queryByTestId("delete-btn") !== null);
    fireEvent.click(dom.container.querySelector("#submit")!);
    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));

    expect(handleSubmit.mock.calls[0]).toEqual([{ children: [""] }]);
  });
});
