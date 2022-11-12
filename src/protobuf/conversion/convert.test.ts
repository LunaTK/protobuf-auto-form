import { describe, expect, it } from "vitest";
import protobuf from "protobufjs";
import { AutoFormContext } from "../../context";
import { proto2Form } from "./proto2Form";
import { form2Proto } from "./form2Proto";

const namespace = protobuf.parse(`
syntax = "proto3";

message User {
  int32 user_id = 1;
  string name = 2;
  repeated int32 friends = 3;
  map<int32, string> items = 4;
}
`).root;

const protoObj = {
  userId: 123,
  name: "Alice",
  friends: [4, 1],
  items: {
    9999: "four nine",
  },
};

const formObj = {
  userId: 123,
  name: "Alice",
  friends: [{ $value: 4 }, { $value: 1 }],
  items: [{ $key: "9999", $value: "four nine" }],
};

describe("Protobuf Conversion", () => {
  const messageType = namespace.resolveAll().lookupType("User");
  const context: AutoFormContext = {
    camelCaseLabel: true,
    hideFieldType: true,
    mode: "mount",
    wellKnownFields: {},
    wellKnownTypes: {},
  };

  it("message type defined", () => {
    expect(messageType, "protobuf reflection").toBeDefined();
  });

  it("proto => form", () => {
    const decoded = proto2Form(context)(protoObj, messageType, undefined);
    expect(decoded).toEqual(formObj);
  });

  it("form => proto", () => {
    const encoded = form2Proto(context)(formObj, messageType, undefined);
    expect(encoded).toEqual(protoObj);
  });
});
