import { describe, expect, it } from "vitest";
import protobuf from "protobufjs";
import { AutoFormContext } from "../../context";
import { proto2Form } from "./proto2Form";
import { form2Proto, pruneUnselectedOneofValues } from "./form2Proto";
import { createDefault } from "./defaults";

describe("Protobuf Conversion", () => {
  const namespace = protobuf.parse(`
syntax = "proto3";

message User {
  int32 user_id = 1;
  string name = 2;
  repeated int32 friends = 3;
  map<int32, string> items = 4;

  oneof someOneof {
    int32 intValue = 10;
    string stringValue = 11;
  }

  repeated Nested msgs = 5;
}

message Nested {
  string foo = 1;
  repeated int32 bar = 2;
}
  `).root;

  const protoObj = {
    userId: 123,
    name: "Alice",
    friends: [4, 1],
    items: {
      9999: "four nine",
    },
    msgs: [
      {
        foo: "foo",
        bar: [111],
      },
    ],
  };

  const formObj = {
    userId: 123,
    name: "Alice",
    friends: [{ $value: 4 }, { $value: 1 }],
    items: [{ $key: "9999", $value: "four nine" }],
    msgs: [{ $value: { foo: "foo", bar: [{ $value: 111 }] } }],
  };
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

describe("Prune / Populate", () => {
  const namespace = protobuf.parse(`
syntax = "proto3";

message User {
  oneof someOneof {
    int32 intValue = 1;
    string stringValue = 2;
  }

  map<int32, string> mapField = 3;
  repeated int32 arrs = 4;

  repeated Nested msgs = 5;
}

message Nested {
  string foo = 1;
  repeated int32 bar = 2;
}
  `).root;

  const messageType = namespace.resolveAll().lookupType("User");

  const formObj = {
    intValue: 123,
    stringValue: "foo",
    someOneof: "stringValue",
  };

  it("prune unselected oneof", () => {
    const pruned = pruneUnselectedOneofValues(formObj, messageType);
    expect(pruned.intValue).toBeUndefined();
  });

  it("populate default values", () => {
    const populated = createDefault(messageType);
    expect(populated).toEqual({
      arrs: [],
      msgs: [],
      mapField: {},
      someOneof: "intValue",
      intValue: 0,
      stringValue: "",
    });
  });
});
