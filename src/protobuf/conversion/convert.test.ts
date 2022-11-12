import { describe, expect, it } from "vitest";
import protobuf from "protobufjs";
import { AutoFormContext } from "../../context";
import { proto2Form } from "./proto2Form";

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

describe("Protobuf Conversion", () => {
  const messageType = namespace.resolveAll().lookupType("User");
  const context: AutoFormContext = {
    camelCaseLabel: true,
    hideFieldType: true,
    mode: "mount",
    wellKnownFields: {},
    wellKnownTypes: {},
  };

  it("proto => form", () => {

    const converted = proto2Form(context)(protoObj, messageType, undefined);
    expect(messageType, "protobuf reflection").toBeDefined();
    expect(converted.friends, "repeated field").toEqual([
      { $value: 4 },
      { $value: 1 },
    ]);
    expect(converted.items, 'map field').toEqual([{ $key: "9999", $value: "four nine" }]);
  });
});
