# profobuf-auto-form

React component that renders a form corresponding to protobuf schema.

# How to use

Using the protobuf schema below,
```protobuf
enum ArticleType {
    SIMPLE = 1;
    DETAILED = 2;
}

message Article {
    string title = 1;
    ArticleType type = 2;
    optional string content = 3;
    repeated string tags = 4;
}
```

## Basic usage

AutoForm required protobufjs reflection object.
You can find the documentation [here](https://github.com/protobufjs/protobuf.js#using-json-descriptors).

```tsx
// obtaining protobuf namespace object
const namespace = protobuf.Namespace.fromJson('', jsonDescriptor)

// jsx
<AutoForm
    messageType="Article"
    namespace={namespace}
    onSubmitValid={(result) => {
        // handle result
    }}
>
    <button type="submit" className="btn btn-xs btn-accent">Submit</button>
</AutoForm>
```

## Providing initial values

The initial value must to be a plain JSON object which is a [valid protobuf message](https://github.com/protobufjs/protobuf.js#valid-message).

```tsx
<AutoForm
    messageType="Article"
    namespace={namespace}
    initialState={/* initial value here */}
    onSubmitValid={(result) => {
        // handle result
    }}
>
    <button type="submit" className="btn btn-xs btn-accent">Submit</button>
</AutoForm>
```

## Overriding input component

There are two way of overriding input component.
1. Overriding field
2. Overriding type

### Example

```tsx
// Overriding input field
const LimittedInput: React.FC<OverriddenFieldProps<string>> = ({
  value,
  onChange,
}) => (
  <input
    value={value}
    maxLength={10} // whatever you want
    onChange={(e) => {
      onChange(e.target.value);
    }}
  />
);

// 1. field override
<AutoForm
    messageType="Article"
    namespace={namespace}
    fieldOverride={{
        title: LimittedInput
    }}
    onSubmitValid={(result) => {
        // handle result
    }}
>
    <button type="submit" className="btn btn-xs btn-accent">Submit</button>
</AutoForm>

// 2. type override
<AutoForm
    messageType="Article"
    namespace={namespace}
    typeOverride={{
        string: LimittedInput
    }}
    onSubmitValid={(result) => {
        // handle result
    }}
>
    <button type="submit" className="btn btn-xs btn-accent">Submit</button>
</AutoForm>
```

