import { describe, expect, it } from "vitest";
import protobuf from "protobufjs";
import { AutoFormContext } from "../../context";
import { fillDefaults, proto2Form } from "./proto2Form";
import { form2Proto, pruneUnselectedOneofValues } from "./form2Proto";

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
    const populated = fillDefaults({}, messageType);
    console.log({ populated })
  })
});
