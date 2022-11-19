import type { AutoFormState } from './autoFormState';

type Foo = { foo: string };
type T1 = AutoFormState<number>;
type T2 = AutoFormState<Foo>;
type T3 = AutoFormState<{ list: Foo[] }>;
type T4 = AutoFormState<{ fd: { [key: number]: unknown } }>;
type T5 = AutoFormState<{ fd: { [key: string]: unknown } }>;
type T6 = AutoFormState<{
  identity: Foo;
  repeateds: number[];
  maps: { [key: string]: Foo };
}>;

// TODO: Compile this file only when the test is run.
const t1: T1 = 123;
const t2: T2 = { foo: 'bar' };
const t3: T3 = { list: [{ $value: { foo: 'bar' } }] };
const t4: T4 = { fd: [{ $key: 653, $value: '' }] };
const t5: T5 = { fd: [{ $key: '653', $value: '' }] };
const t6: T6 = {
  identity: { foo: 'bar' },
  repeateds: [{ $value: 123 }],
  maps: [{ $key: 'foo', $value: { foo: 'bar' } }],
};
